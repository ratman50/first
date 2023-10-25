import { createParamDecorator } from "@nestjs/common";

export const UserId=createParamDecorator(
    (data,req)=>{
        const user=req.user;
        return user ? user.id:undefined;
    }
);