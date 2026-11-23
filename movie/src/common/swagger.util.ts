import { ApiResponse } from '@nestjs/swagger';

type ErrorExample = { code: string; message: string };

/**
 * 성공 응답 예시를 Swagger에 등록합니다.
 * 우리 API의 공통 응답 형식 { isSuccess, code, message, result }에 맞춰 예시를 만들어줍니다.
 */
export const ApiSuccessResponse = (status: number, code: string, message: string, result: unknown) =>
    ApiResponse({
        status,
        description: `${message} (${code})`,
        schema: { example: { isSuccess: true, code, message, result } },
    });

/**
 * 실패 응답 예시를 Swagger에 등록합니다.
 * 같은 상태 코드에 code가 여러 개면(예: 401의 AUTH401_2/3/4) 드롭다운으로 골라 볼 수 있게 각각 예시로 넣습니다.
 */
export const ApiErrorResponse = (status: number, ...errors: ErrorExample[]) =>
    ApiResponse({
        status,
        description: errors.map((e) => `${e.code} · ${e.message}`).join(' / '),
        content: {
            'application/json': {
                examples: Object.fromEntries(
                    errors.map((e, i) => [
                        // 같은 code가 두 번 나오면(예: 400 검증 실패 두 종류) 예시가 덮어써지지 않게 번호를 붙입니다.
                        errors.findIndex((other) => other.code === e.code) === i ? e.code : `${e.code} (${i + 1})`,
                        {
                            summary: e.message,
                            value: { isSuccess: false, code: e.code, message: e.message, result: null },
                        },
                    ]),
                ),
            },
        },
    });

/** AuthGuard가 던지는 401 응답들입니다. 토큰이 필요한 API에 공통으로 붙입니다. */
export const ApiAuthErrorResponse = () =>
    ApiErrorResponse(
        401,
        { code: 'AUTH401_2', message: '로그인이 필요한 요청입니다.' },
        { code: 'AUTH401_3', message: '유효하지 않은 토큰입니다.' },
        { code: 'AUTH401_4', message: '토큰이 만료되었습니다. 다시 로그인해주세요.' },
    );

/** 경로 변수에 숫자가 아닌 값이 들어왔을 때 ParseIntPipe가 던지는 400 응답입니다. */
export const PARSE_INT_ERROR: ErrorExample = {
    code: 'COMMON400',
    message: 'Validation failed (numeric string is expected)',
};

export const MEMBER_NOT_FOUND: ErrorExample = { code: 'MEMBER404_1', message: '해당 회원을 찾을 수 없습니다.' };
