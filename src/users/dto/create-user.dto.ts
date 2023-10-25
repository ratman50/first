import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    readonly nom:string
    @IsEmail()
    readonly email:string
    @IsNotEmpty()
    readonly username:string
    @IsNotEmpty()
    readonly password:string

}
