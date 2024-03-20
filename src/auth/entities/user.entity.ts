import { IsEmail, IsNotEmpty, Length, Min } from "class-validator";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text')
    @IsEmail()
    @IsNotEmpty()
    @Index({ unique: true })
    email:string;

    @Column({
        select: false
    })
    @Length(6, 100)
    @IsNotEmpty()
    password:string;

    @Column('text')
    @IsNotEmpty()
    fullName:string;
    
    @Column({
        type: "bool",
        default: false
    })
    isActive:boolean;

    @Column('text',{
        array:true,
        default:['user']
    })
    @IsNotEmpty()
    roles:string[];

    @OneToMany(() => Product, (product) => product.user)
    product: Product[]


    //*Hacer algo antes de Insert
    @BeforeInsert()
    checkFieldsBedoreInsert(){
        this.email = this.email.toLowerCase().trim()
    }

    //*Hacer algo antes de Update
    @BeforeUpdate()
    checkFieldsBedoreUpdate(){
        this.checkFieldsBedoreInsert();
    }

    
}
