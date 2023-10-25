import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResetDto } from './dto/reset.dto';
import { ResetPasswordConfirmationDto } from './dto/resetPasswordConfirmation.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from "express";
import { log } from 'console';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags("authentification")
export class AuthController {
    constructor(private _authService:AuthService){}
    @Post("register")
    register(@Body() registerDto:RegisterDto ){
        return this._authService.register(registerDto);
    }

    @Post("login")
    login(@Body() loginDto: LoginDto){
        return this._authService.login(loginDto);
    }
    @Post('reset')
    resetPassword(@Body() resetDto:ResetDto){
        return this._authService.reset(resetDto);
    }
    @Post("password-confirmation")
    resetPasswordConfirmation(@Body() resetPasswordConfirmationDto:ResetPasswordConfirmationDto){
        return this._authService.resetPasswordConfirmation(resetPasswordConfirmationDto);
    }
    @UseGuards(AuthGuard("jwt"))
    @Delete("delete")
    deleteAccount(@Req() request: Request, @Body() deleteAcccountDto: DeleteAccountDto){
        const idUser= request.user as {id:number};
        return this._authService.deleteAccount(idUser.id, deleteAcccountDto);
        
    }
}
