import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterDto{
    @IsEmail()
    @ApiProperty()
    readonly email:string;
    @ApiProperty()
    @IsNotEmpty()
    readonly nom:string
    @ApiProperty()
    @IsNotEmpty()
    readonly username:string;
    
    @ApiProperty()
    @IsNotEmpty()
    readonly password:string 

}