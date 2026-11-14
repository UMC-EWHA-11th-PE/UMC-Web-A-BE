import {Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards} from "@nestjs/common";
import {MemberService} from "../service/member.service";
import {CreateMemberDto} from "../dto/create-member.dto";
import {AuthGuard} from "../guard/auth.guard";
import type { Request } from "express";
import {MemberUpdateRequestDto} from "../dto/member-update-request.dto";

@Controller("members")
export class MemberController {
    constructor(private readonly memberService: MemberService) {
    }

    @Get("nickname/:nickname")
    checkNickname(@Param("nickname") nickname: string) {
        return this.memberService.checkNickname(nickname);
    }

    @Get("email/:email")
    checkEmail(@Param("email") email: string) {
        return this.memberService.checkEmail(email);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async signUp(@Body() dto: CreateMemberDto) {
        const result = await this.memberService.signUp(dto);
        return {
            isSuccess: true,
            code: "COMMON201",
            message: "회원가입에 성공했습니다.",
            result,
        }
    }

    @Get('me')
    @UseGuards(AuthGuard)
    async getMyInfo(@Req() request: Request) {
        const memberId = request['memberId'] as number;

        const result = await this.memberService.getMyInfo(memberId);

        return {
            isSuccess: true,
            code: "COMMON200",
            message: '회원 정보를 조회했습니다.',
            result,
        }
    }

    @Patch('me')
    @UseGuards(AuthGuard)
    async updateMyInfo(
        @Req() request: Request,
        @Body() dto: MemberUpdateRequestDto,
    ){
        const memberId = request['memberId'] as number;

        const result = await this.memberService.updateMyInfo(memberId, dto);
        return {
            isSuccess: true,
            code: "COMMON200",
            message: '회원 정보를 수정했습니다.',
            result,
        }
    }
}