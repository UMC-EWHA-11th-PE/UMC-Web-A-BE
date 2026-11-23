import {Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards} from "@nestjs/common";
import {MemberService} from "../service/member.service";
import {CreateMemberDto} from "../dto/create-member.dto";
import {AuthGuard} from "../guard/auth.guard";
import type { Request } from "express";
import {MemberUpdateRequestDto} from "../dto/member-update-request.dto";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
@ApiTags('회원')
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

    @ApiOperation({
        summary: '회원가입',
        description: '이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.',
    })
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

    @ApiOperation({
        summary: '내 정보 조회',
        description: '토큰의 주인인 회원의 이메일, 닉네임, 가입일을 조회합니다. 토큰이 필요합니다.',
    })
    @ApiBearerAuth('bearerAuth')
    @ApiResponse({status: 200, description: '내 정보 조회 성공 (COMMON200)'})
    @ApiResponse({status: 401, description: 'AUTH401_2 · 토큰이 없음 / AUTH401_3 · 유효하지 않은 토큰'})
    @ApiResponse({status: 404, description: 'MEMBER404_1 · 해당 회원을 찾을 수 없음'})
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

    @ApiOperation({
        summary: '내 정보 수정',
        description: '토큰의 주인인 회원의 닉네임을 변경합니다. 토큰이 필요합니다.',
    })
    @ApiBearerAuth('bearerAuth')
    @ApiResponse({status: 200, description: '내 정보 수정 성공 (COMMON200)'})
    @ApiResponse({status: 400, description: 'COMMON400 · 닉네임 검증 실패'})
    @ApiResponse({status: 401, description: 'AUTH401_2 · 토큰이 없음 / AUTH401_3 · 유효하지 않은 토큰'})
    @ApiResponse({status: 404, description: 'MEMBER404_1 · 해당 회원을 찾을 수 없음'})
    @ApiResponse({status: 409, description: 'MEMBER409_1 · 이미 사용 중인 닉네임'})
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