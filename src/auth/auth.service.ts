import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt";
import { MaillerService } from 'src/mailler/mailler.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ResetDto } from './dto/reset.dto';
import * as speakeasy from 'speakeasy';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmation.dto';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
@Injectable()
export class AuthService {



    constructor(
        private readonly prismaService: PrismaService,
        private readonly mailerService: MaillerService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async reset(resetDto: ResetDto) {
        const { email } = resetDto;
        const user = await this.byEmail(email);
        if (!user)
            throw new NotFoundException("user not found");
        const code = speakeasy.totp({
            secret: this.configService.get("OTP_CODE")!,
            digits: 5,
            step: 60 * 15,
            encoding: "base32"
        });
        const url = "http://localhost:3000/password-confirmation";
        this.mailerService.sendResetPassword(email, url, code);
        return { data: "Reset password mail has been send" };
    }
    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        //verifier si le user existe
        const userFind = await this.notExist(email, "Identifiant non valide", "login");
        //comparer le mot de passe
        const match = await bcrypt.compare(password, userFind?.password!);
        if (!match) {
            throw new UnauthorizedException("Identifiant non valide");
        }
        //generer un token
        const payload = { email: email, password: password };
        return {
            token: await this.jwtService.signAsync(payload),
            user: userFind
        };
    }
    async register(registerDto: RegisterDto) {
        const { username, email, password, nom } = registerDto;

        // verifier si le user exists;
        await this.notExist(email, "user already exists");
        //Hasher le mot de passe
        const hash = await bcrypt.hash(password, 10);
        //Enregister l'user
        const newUser = await this.prismaService.user.create({
            data: { email, username, password: hash, nom }
        });
        // envoie email
        await this.mailerService.registerConfirmation(email);
        return {
            data: "User created successfull"
        };
    }
    async byEmail(email: string) {
        return await this.prismaService.user.findUnique({
            where: { email }
        })

    }
    async notExist(email: string, message: string, method = "register") {
        // Verifier si le user existe
        const user = await this.byEmail(email);
        if (user && method == "register") throw new ConflictException(message);
        return user;
    }
    async resetPasswordConfirmation(resetPasswordConfirmationDto: ResetPasswordConfirmationDto) {
        const { email, code, password } = resetPasswordConfirmationDto;
        const user = await this.byEmail(email);
        if (!user)
            throw new NotFoundException("user not found");

        const match = speakeasy.totp.verify({
            secret: this.configService.get("OTP_CODE")!,
            token: code,
            digits: 5,
            step: 60 * 15,
            encoding: "base32"
        });
        if (!match)
            throw new UnauthorizedException("Invalid/expired token");
        const hash = await bcrypt.hash(password, 10);
        await this.prismaService.user.update({
            where: { email }, data: { password: hash }
        });
        return {
            data: "password updated"
        };
    }
    async deleteAccount(idUser: number, deleteAcccountDto: DeleteAccountDto) {
         const user=await this.byEmail(deleteAcccountDto.email);
         if(!user)
            throw new NotFoundException("user not exists");
        const {id}=user;
        await this.prismaService.user.delete({
            where:{
                id
            }
        });
        return {
            data:"User successfully deleted"
        };
    }
}
