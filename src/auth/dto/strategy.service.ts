import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "../constants";
import { PrismaService } from "src/prisma/prisma.service";
type Payload={
    email:string,
    password:string
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly prismaService:PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConstants.secret,
            ignoreExpiration: false
        })
    }
    async validate(payload: Payload){
        const user=await this.prismaService.user.findUnique({
            where:{
                email:payload.email
            }
        });
        if(!user) throw new UnauthorizedException("Unauthorized");
        Reflect.deleteProperty(user,"password");
        return user;
    }
}