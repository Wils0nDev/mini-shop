import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

//los Dtos no transforman data.
export class PaginationDto {
    
    @IsOptional()
    @IsPositive()
    //Transformar Data
    @Type(()=>Number)  //*Esto es similar al enableImplicitConversions : true
    limit?:number;

    @IsOptional()
    @IsPositive()
    @Min(0)
    @Type(()=>Number)
    offset?:number;
}