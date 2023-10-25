import { Global, Injectable } from '@nestjs/common';
import * as nodemailler from 'nodemailer';
@Injectable()
export class MaillerService {
    private async  transporter() {
        const testAccount= await nodemailler.createTestAccount();
        return nodemailler.createTransport({
            host:"localhost",
            port:1025,
            ignoreTLS:true,
            auth:{
                user:testAccount.user,
                pass:testAccount.pass
            }
        });
    }

    async registerConfirmation(userEmail:string){
        (await this.transporter()).sendMail({
            from:"app@localhost.com",
            to:userEmail,
            subject:"INSCRIPTION",
            html:`<h3>Confirmation of inscription</h3>`
        });
    }
    async sendResetPassword(userEmail:string,url:string,code:string){
        (await this.transporter()).sendMail({
            from:"app@localhost.com",
            to:userEmail,
            subject:"reset password",
            html:`
            <a href="${url}">Reset password</a>
            <p>Secret code <strong> ${code}</strong></p>
            <p>Code will expire in 15 minutes</p>
            `
        });
    }
}
