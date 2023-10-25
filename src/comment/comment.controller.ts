import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from "express";
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserId } from 'src/decorators/user.decorator';


@Controller('comment')
@ApiTags("comment")
@UseGuards(AuthGuard("jwt"))
@ApiBearerAuth()

export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post("/post/:id")
  create(@Param("id", ParseIntPipe) id: number, @Body() createCommentDto: CreateCommentDto, @Req() request: Request) {
    const userId = (request.user as { id: number }).id;
    return this.commentService.create(userId, id, createCommentDto);
  }

  @Get()
  findAll(@UserId() id: number) {
    return this.commentService.findAll(id);
  }
  @Get(':id')
  findOne(@Param('id') id: string, @UserId() userId: number) {
    return this.commentService.findOne(+id, userId);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @UserId() user_id: number) {
    return this.commentService.update(+id, updateCommentDto, user_id);
  }
  @Delete('/post/:id')
  remove(@Param('id', ParseIntPipe) id: number, @UserId() userId: number) {
    return this.commentService.remove(id, userId);
  }
}
