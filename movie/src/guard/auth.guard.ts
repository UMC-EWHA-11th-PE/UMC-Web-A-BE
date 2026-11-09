import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import type { Request } from 'express'; // 데코레이터 시그니처에 쓰는 타입은 import type 이어야 합니다
import { ApiException } from '../exception/api.exception';


const BEARER_PREFIX = 'Bearer ';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request & { memberId?: number }>();
        const header = request.headers.authorization;

        //BEARER {토큰} 의 형식이 아닌 경우
        if(!header || !header.startsWith(BEARER_PREFIX)) {
            throw new ApiException(
                HttpStatus.UNAUTHORIZED,
                'AUTH401_2',
                '로그인이 필요한 요청입니다.',
            );
        }

        const token = header.slice(BEARER_PREFIX.length);

        try {
            //서명과 만료시간 함께 검증
            const payload = await this.jwtService.verifyAsync<{ sub: string; email: string }>(token);

            //컨트롤러가 꺼내 쓸 수 있도록 request 객체에 담기
            request['memberId'] = Number(payload.sub);
        } catch (error) {
            if(error instanceof TokenExpiredError) {
                throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    'AUTH401_4',
                    '토큰이 만료되었습니다. 다시 로그인해주세요.',
                )
            }
            throw new ApiException(
                HttpStatus.UNAUTHORIZED,
                'AUTH401_3',
                '유효하지 않은 토큰입니다.',
            )
        }

        return true;
    }
}