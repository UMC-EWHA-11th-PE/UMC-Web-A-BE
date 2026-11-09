import {ConflictException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Not, Repository} from "typeorm";
import {Member} from "../entity/member.entity";
import {CheckResponseDto} from "../dto/check-response.dto";
import {CreateMemberDto} from "../dto/create-member.dto";
import * as bcrypt from "bcrypt";
import {isDuplicateKeyError} from "../common/db-error.util";
import {MemberInfoResponseDto} from "../dto/member-info-response.dto";
import {ApiException} from "../filter/api.exception";
import {MemberUpdateRequestDto} from "../dto/member-update-request.dto";

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

        const existingNickname = await this.memberRepository.findOneBy({nickname: dto.nickname});
        if (existingNickname) {
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

        return {
            memberId: savedMember.memberId,
            email: savedMember.email,
            nickname: savedMember.nickname,
        }
    }

    async getMyInfo(memberId: number): Promise<MemberInfoResponseDto> {
        const member = await this.memberRepository.findOne({where: {memberId}});

        if (!member) {
            throw new ApiException(
                HttpStatus.NOT_FOUND,
                'MEMBER404_1',
                '해당 회원을 찾을 수 없습니다.',
            );
        }

        return MemberInfoResponseDto.from(member);
    }

    async updateMyInfo(
        memberId: number,
        dto: MemberUpdateRequestDto,
    ): Promise<MemberInfoResponseDto> {
        const member = await this.memberRepository.findOne({where: {memberId},});

        if(!member) {
            throw new ApiException(
                HttpStatus.NOT_FOUND,
                'MEMBER404_1',
                '해당 회원을 찾을 수 없습니다.',
            );
        }

        const duplicated=await this.memberRepository.findOne({
            where: {nickname: dto.nickname, memberId: Not(memberId)},
        });

        if(duplicated){
            throw new ApiException(
                HttpStatus.CONFLICT,
                'MEMBER409_1',
                '이미 사용 중인 닉네임입니다.',
            )
        }

        member.nickname = dto.nickname;
        await this.memberRepository.save(member);

        return MemberInfoResponseDto.from(member);
    }
}