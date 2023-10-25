import { IsEmail } from "class-validator";

export class ResetDto{
    @IsEmail()
    readonly email:string;
}