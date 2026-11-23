import {Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards} from "@nestjs/common";
import {MemberService} from "../service/member.service";
import {CreateMemberDto} from "../dto/create-member.dto";
import {AuthGuard} from "../guard/auth.guard";
import type { Request } from "express";
import {MemberUpdateRequestDto} from "../dto/member-update-request.dto";
import {ApiAuthErrorResponse, ApiErrorResponse, ApiSuccessResponse, MEMBER_NOT_FOUND} from "../common/swagger.util";
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
@ApiTags('회원')
@Controller("members")
export class MemberController {
    constructor(private readonly memberService: MemberService) {
    }

    @ApiOperation({summary: '닉네임 중복 확인', description: '가입 전에 닉네임을 쓸 수 있는지 확인합니다. 토큰 없이 호출할 수 있는 공개 API입니다.'})
    // 이 API는 공통 응답 형식으로 감싸지 않고 결과 객체를 그대로 돌려줍니다.
    @ApiResponse({status: 200, description: 'available이 true면 사용 가능', schema: {example: {available: true}}})
    @Get("nickname/:nickname")
    checkNickname(@Param("nickname") nickname: string) {
        return this.memberService.checkNickname(nickname);
    }

    @ApiOperation({summary: '이메일 중복 확인', description: '가입 전에 이메일을 쓸 수 있는지 확인합니다. 토큰 없이 호출할 수 있는 공개 API입니다.'})
    // 이 API는 공통 응답 형식으로 감싸지 않고 결과 객체를 그대로 돌려줍니다.
    @ApiResponse({status: 200, description: 'available이 true면 사용 가능', schema: {example: {available: true}}})
    @Get("email/:email")
    checkEmail(@Param("email") email: string) {
        return this.memberService.checkEmail(email);
    }

    @ApiOperation({
        summary: '회원가입',
        description: '이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다.',
    })
    @ApiSuccessResponse(201, 'COMMON201', '회원가입에 성공했습니다.', {memberId: 1, email: 'challenger@umc.com', nickname: '영화조아'})
    @ApiErrorResponse(400, {code: 'COMMON400', message: '올바른 이메일 형식이 아닙니다.'})
    @ApiErrorResponse(409, {code: 'COMMON409', message: '이미 사용중인 이메일입니다.'})
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
    @ApiSuccessResponse(200, 'COMMON200', '회원 정보를 조회했습니다.', {email: 'challenger@umc.com', nickname: '영화조아', createdAt: '2026-11-01T12:00:00.000Z'})
    @ApiAuthErrorResponse()
    @ApiErrorResponse(404, MEMBER_NOT_FOUND)
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
    @ApiSuccessResponse(200, 'COMMON200', '회원 정보를 수정했습니다.', {email: 'challenger@umc.com', nickname: '팝콘러버', createdAt: '2026-11-01T12:00:00.000Z'})
    @ApiErrorResponse(400, {code: 'COMMON400', message: '닉네임은 2자 이상 12자 이하여야 합니다.'})
    @ApiAuthErrorResponse()
    @ApiErrorResponse(404, MEMBER_NOT_FOUND)
    @ApiErrorResponse(409, {code: 'MEMBER409_1', message: '이미 사용 중인 닉네임입니다.'})
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