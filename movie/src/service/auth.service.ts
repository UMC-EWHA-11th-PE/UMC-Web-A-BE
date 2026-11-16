import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Member } from "../entity/member.entity";
import { LoginRequestDto } from "../dto/longin-request.dto";
import { LoginResponseDto } from "../dto/login-response.dto";
import { ApiException } from "../exception/api.exception";


@Injectable() 
export class AuthService {
    constructor(
        @InjectRepository(Member)
        private readonly memberRspository: Repository<Member>,
        private readonly jwtService: JwtService,
    ) {}


    //longin 함수 정의
    async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
        //email로 repository에서 멤버 검색하기
        const member = await this.memberRspository.findOne({
            where: { email: dto.email },
        })

        //해당 이메일의 멤버가 없다면 exception
        if (!member) {
            throw new ApiException(
                HttpStatus.UNAUTHORIZED,
                'AUTH401_1',
                '이메일 또는 비밀번호가 올바르지 않습니다. ',
            )
        }

        //해당 이메일의 멤버가 있다면 db의 패스워드와 매치되는지 확인
        const isPasswordMatched = await bcrypt.compare(dto.password, member.password)

        //패스워드 hash값이 서로 일치하지 않는다면 exception
        if(!isPasswordMatched) {
            throw new ApiException(
                HttpStatus.UNAUTHORIZED,
                'AUTH401_1',
                '이메일 또는 비밀번호가 올바르지 않습니다.',
            )
        }

        //엑세스 토큰 발급
        const accessToken = await this.jwtService.signAsync({
            sub: String(member.memberId),   //JWT 표준에서 이 토큰의 주인을 뜻하는 항목
            email: member.email,
        });

        //응답 반환
        return {
            nickname: member.nickname,
            accessToken,
        }
    }



}
