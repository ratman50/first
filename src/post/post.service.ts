import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  userInclue = {
    id: true,
    username: true,
    nom: true,

  }
  constructor(
    private readonly _prismaService: PrismaService,
  ) { }
  async create(createPostDto: CreatePostDto, user_id: number) {
    const { body, title } = createPostDto;
    const newtPost=await this._prismaService.post.create({
      data: {
        body,
        title,
        user_id
      }
    })
    // const {id}=newtPost;
    // const dataNewPost=await this._prismaService.post.findUnique({
    //   where:{
    //     id
    //   },
    //   include:{
    //     user:{
    //       select:this.userInclue
    //     }
    //   }

    // });
    // Reflect.deleteProperty(dataNewPost!,"user_id");
    return {
      "data":await this.findUniquePost(newtPost.id) ,
    };
  }

  async findAll(user_id:number) {
    const data = await this._prismaService.post.findMany({
      where:{
        user_id
      },
      include: {
        user: {
          select: this.userInclue
        },
        comments: {
          include: {
            user: {
              select: this.userInclue
            }
          }
        }
      }
    });
    return {
      "data": data
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(id: number, updatePostDto: UpdatePostDto,idUser:number) {

    const post=await this.findPost(id,idUser);
    const postUpdate=await this._prismaService.post.update({
      data:updatePostDto,
      where:{
        id
      }
    });
    return {
      "data":await this.findUniquePost(postUpdate.id)
    };
  }
  
  async  findPost(id:number,user_id:number){
    const post = await this._prismaService.post.findUnique({
      where: { id,user_id }
    });
    if (!post)
      throw new NotFoundException("post doesn't exist");
    return post;
  }
  async findUniquePost(id:number){
    const post = await this._prismaService.post.findUnique({
      where: { id }
    });
    if (!post)
      throw new NotFoundException("post doesn't exist");
    const result= await this._prismaService.post.findUnique({
      where:{
        id
      },
      include:{
        user:{
          select:this.userInclue
        }
      }

    });
    Reflect.deleteProperty(result!,"user_id");
    return result;
  }
  async remove(id: number,user_id:number) {
    const post = this.findPost(id,user_id);
    await this._prismaService.post.delete({
      where: { id }
    });
    return {
      "message": "post  deleted"
    };
  }
}
