import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  templateInclude={
    user:{
      select:{
        id:true,
        username:true,
        email:true,
        nom:true

      },
    },
    post:{
      select:{
        id:true,
        title:true,
        body:true
      }
    }
  }
  constructor(private readonly _prismaService:PrismaService){}
  async findUser(id:number){
    const user=await this._prismaService.user.findUnique({
      where:{id}
    });
    if(!user){
      throw new NotFoundException("user doesn't exist");
    }
    return user;
  }
  async findPost(id:number){
    const post=await this._prismaService.post.findUnique({
      where:{id}
    });
    if(!post){
      throw new NotFoundException("post doesn't exist");
    }
    return post;
  }
  async findComment(id:number){
    return await this._prismaService.comment.findUnique({
      where:{id},
      include:this.templateInclude
    });
  }
  async create(user_id:number, post_id:number,createCommentDto: CreateCommentDto) {
    await this.findUser(user_id);
    await this.findPost(post_id);
    const newComment=await this._prismaService.comment.create({
      data:{
        user_id:user_id,
        post_id:post_id,
        content:createCommentDto.content
      }
    });
    return {
      "data":await this.findComment( newComment.id)
    }
  }
  async findUserComment(id:number,user_id:number){
    const post =await this._prismaService.comment.findUnique({
      where:{id,user_id},
      include:this.templateInclude
    });
    if(!post)
      throw new NotFoundException("post doesn't exist");
    return post;
  }
  async findAll(user_id:number) {
    return {
      "data":await this._prismaService.comment.findMany({
        where:{
          user_id
        },
        include:{
          user:{
            select:{
              nom:true,
              id:true
            }
          },
          post:{
            select:{
              id:true,
              title:true,
              body:true
            }
          }
        }
      })
    };
  }

  async findOne(id: number,user_id:number) { 
    return {
      "data":await this.findUserComment(id,user_id)
    };
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, user_id:number) {
    await this.findUserComment(id,user_id);
    const commentUpdated=await this._prismaService.comment.update({
      where:{id},
      data:{...updateCommentDto}
    })
    return {
      data:await this.findComment(commentUpdated.id)
    };
  }

  async remove(id: number,userId:number) {
    await this.findUserComment(id,userId);
    await this._prismaService.comment.delete({
      where:{id}
    });
    return {
      "message":"comment deleted successfull"
    };
  }
}
