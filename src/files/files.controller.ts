import { Controller,Post, ParseFilePipe, UploadedFile, UseInterceptors, MaxFileSizeValidator, FileTypeValidator, BadRequestException, BadGatewayException, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileName } from './helpers/FileName.help';
import { fileFilter } from './helpers/FileFilter.help';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Files - Get and Upuload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService : ConfigService
    ) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
      fileFilter: fileFilter,
      storage : diskStorage({
        destination : './static/products',
        filename : FileName
      }),
    }
  ))
  uploadProductImage(@UploadedFile('file', new ParseFilePipe({
    fileIsRequired : false,
    validators : [ new FileTypeValidator({fileType : '.(png|jpeg|jpg)' })]
  })) file : Express.Multer.File){

    if(!file) throw new BadRequestException('El archivo debe ser una imagen')
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}` 
    return { secureUrl };
    
  }

  
  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName : string
    ){
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }

  
}
