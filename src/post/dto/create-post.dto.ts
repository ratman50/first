import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class CreatePostDto {
    @IsNotEmpty()
    readonly title:string

    @IsNotEmpty()
    readonly body:string
}
