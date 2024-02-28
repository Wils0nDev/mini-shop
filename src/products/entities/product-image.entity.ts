import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";


@Entity()
export class ProductImage {
   
    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string;

    //muchas imagenes pertencen a un solo producto : Many to One
    @ManyToOne(() => Product, (product) => product.images,{
        onDelete:'CASCADE'
    })
    product: Product
}