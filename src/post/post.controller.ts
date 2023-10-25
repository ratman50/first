import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from "express";
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
@Controller('post')
@ApiTags("post")
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class PostController {
  constructor(private readonly postService: PostService) { }

  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() request: Request) {
    const userId = (request.user as { id: number }).id;
    return this.postService.create(createPostDto, userId);
  }
  @Get()
  findAll(@Req() request:Request) {
    const userId=(request.user as {id:number}).id;
    return this.postService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Req() request: Request) {
    if (!updatePostDto.body && !updatePostDto.title)
      throw new BadRequestException("title or body is required");
    const userId = (request.user as { id: number }).id;

    return this.postService.update(+id, updatePostDto,userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() request: Request) {
    const userId = (request.user as { id: number }).id;
    return this.postService.remove(id, userId);
  }
}
