import {CanActivate, ExecutionContext, HttpStatus, Injectable} from "@nestjs/common";
import {JwtService, TokenExpiredError} from "@nestjs/jwt";
import type {Request} from "express";
import {ApiException} from "../filter/api.exception";

const BEARER_PREFIX = 'Bearer ';
const BEARER_PATTERN = /^Bearer\s+(\S+)\s*$/i;

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const match=request.headers.authorization?.match(BEARER_PATTERN);

        if (!match) {
            throw new ApiException(
                HttpStatus.UNAUTHORIZED,
                'AUTH401_2',
                '로그인이 필요한 요청입니다.',
            );
        }

        const token = match[1];

        try {
            const payload = await this.jwtService.verifyAsync<{ sub: string; email: string }>(token);

            request['memberId'] = Number(payload.sub);
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    'AUTH401_4',
                    '토큰이 만료되었습니다. 다시 로그인해주세요.',
                );
            }
            throw new ApiException(
                HttpStatus.UNAUTHORIZED,
                'AUTH401_3',
                '유효하지 않은 토큰입니다.',
            );

        }
        return true;

    }
}