import {IsNotEmpty, IsString, Length} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class MemberUpdateRequestDto{
    @ApiProperty({description: '바꿀 닉네임 (2자 이상 12자 이하)', example: '팝콘러버'})
    @IsString()
    @IsNotEmpty({message:'닉네임을 입력해주세요.'})
    @Length(2, 12, {message: '닉네임은 2자 이상 12자 이하여야 합니다.'})
    nickname: string;
}