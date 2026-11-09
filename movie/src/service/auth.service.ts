import {HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {LoginRequestDto} from "../dto/login-request.dto";
import {LoginResponseDTO} from "../dto/login-response.dto";
import {Member} from "../entity/member.entity";
import {ApiException} from "../filter/api.exception";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Member)
        private readonly memberRepository: Repository<Member>,
        private readonly jwtService: JwtService,
    ) {
    }

    async login(dto: LoginRequestDto): Promise<LoginResponseDTO> {
        const member=await this.memberRepository.findOne({
            where: {email: dto.email},
        });

        if (!member) {
            throw new ApiException(
                HttpStatus.UNAUTHORIZED,
                'AUTH401_1',
                '이메일 또는 비밀번호가 올바르지 않습니다.'
            );
        }

        const isPasswordMatched= await bcrypt.compare(dto.password, member.password);

        if(!isPasswordMatched){
            throw new ApiException(
                HttpStatus.UNAUTHORIZED,
                'AUTH401_1',
                '이메일 또는 비밀번호가 올바르지 않습니다.'
            );
        }

        const accessToken = await this.jwtService.signAsync({
            sub: String(member.memberId),
            email: member.email,
        });

        return {
            nickname: member.nickname,
            accessToken,
        }
    }
}