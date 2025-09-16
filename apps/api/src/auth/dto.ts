import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'username' })
    username: string;

    @IsNotEmpty()
    @ApiProperty()
    password: string;
}