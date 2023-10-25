import { IsEmail } from "class-validator";

export class DeleteAccountDto{
    @IsEmail()
    readonly email:string
}