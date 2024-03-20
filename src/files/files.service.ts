import { join } from 'path';
import { existsSync } from 'fs';
import { BadRequestException, Injectable } from '@nestjs/common';
import multer from 'multer';
import { FileName } from './helpers/FileName.help';


@Injectable()
export class FilesService {
  
     getStaticProductImage( imageName : string){

        const path = join(__dirname, '../../static/products', imageName);
        if(!existsSync(path))
            throw new BadRequestException(`No se encuentra la imagen ${imageName}`);
    
        return path;
    }
}
