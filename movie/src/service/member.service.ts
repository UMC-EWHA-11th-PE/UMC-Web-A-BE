import {ConflictException, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Member} from "../entity/member.entity";
import {CheckResponseDto} from "../dto/check-response.dto";
import {CreateMemberDto} from "../dto/create-member.dto";
import * as bcrypt from "bcrypt";
import {isDuplicateKeyError} from "../common/db-error.util";

@Injectable()
export class MemberService {
    constructor(
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,
    ) {
    }

    async checkNickname(nickname: string): Promise<CheckResponseDto> {
        const exists = await this.memberRepository.exists({
            where: {nickname},
        });
        return {available: !exists};
    }

    async checkEmail(email: string): Promise<CheckResponseDto> {
        const exists = await this.memberRepository.exists({where: {email}});
        return {available: !exists};
    }

    async signUp(dto: CreateMemberDto) {
        const existingEmail = await this.memberRepository.findOneBy({email: dto.email});
        if (existingEmail) {
            throw new ConflictException('이미 사용중인 이메일입니다.')
        }

        const existingNickname=await this.memberRepository.findOneBy({nickname: dto.nickname});
        if(existingNickname){
            throw new ConflictException('이미 사용중인 닉네임입니다.')
        }

        const member = this.memberRepository.create({
            email: dto.email,
            password: await bcrypt.hash(dto.password, 10),
            nickname: dto.nickname,
        });

        let savedMember: Member;
        try {
            savedMember = await this.memberRepository.save(member);
        } catch (e) {
            if (isDuplicateKeyError(e)) {
                const emailTaken = await this.memberRepository.exists({where: {email: dto.email}});
                throw new ConflictException(emailTaken ? '이미 사용중인 이메일입니다.' : '이미 사용중인 닉네임입니다.');
            }
            throw e;
        }

        return{
            memberId: savedMember.memberId,
            email: savedMember.email,
            nickname: savedMember.nickname,
        }
    }
}