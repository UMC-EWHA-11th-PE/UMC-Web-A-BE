import {IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength, ValidateBy} from "class-validator";

const BCRYPT_MAX_BYTES = 72;

const MaxByteLength = (max: number, message: string) =>
    ValidateBy({
        name: 'maxByteLength',
        validator: {
            validate: (value: unknown) =>
                typeof value === 'string' && Buffer.byteLength(value, 'utf8') <= max,
            defaultMessage: () => message,
        },
    });

export class CreateMemberDto{
    @IsEmail({}, {message:'올바른 이메일 형식이 아닙니다.'})
    email: string;

    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/, {message: '비밀번호는 대문자/소문자/숫자/특수문자를 포함한 8자 이상이어야 합니다.',})
    @MaxByteLength(BCRYPT_MAX_BYTES, `비밀번호는 ${BCRYPT_MAX_BYTES}바이트 이하여야 합니다.`)
    password: string;

    @IsString()
    @IsNotEmpty({message:'닉네임을 입력해주세요.'})
    @MinLength(2, {message: '닉네임은 2자 이상이어야 합니다.'})
    @MaxLength(12, {message: '닉네임은 12자 이하여야 합니다.'})
    nickname: string;
}
