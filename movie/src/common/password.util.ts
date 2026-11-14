import {ValidateBy} from "class-validator";

export const BCRYPT_MAX_BYTES = 72;

export const isWithinBcryptLimit = (value: string): boolean =>
    Buffer.byteLength(value, 'utf-8') <= BCRYPT_MAX_BYTES;

export const MaxBcryptBytes=(message=`비밀번호는 ${BCRYPT_MAX_BYTES}바이트 이하여야 합니다.`)=>
    ValidateBy({
        name: 'maxBcryptBytes',
        validator: {
            validate: (value: unknown) =>
                typeof value === 'string' && isWithinBcryptLimit(value),
            defaultMessage: () => message,
        },
    })