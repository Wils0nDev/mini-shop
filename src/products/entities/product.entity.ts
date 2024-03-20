import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  //*ApiProperty: nos permite establecer propieades 
  @ApiProperty({
    example: '09137c66-cc48-41bb-b1f3-fab4f6cf52e0',
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Title MiniShop',
    description: 'Prouct title',
    uniqueItems: true
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Prouct price',
    uniqueItems: true
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: 'Esta es nu descripción de ejemplo',
    description: 'Prouct description',
    default: null
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 'Title-MiniShop',
    description: 'Prouct SLUG - for-SEED',
    uniqueItems: true
  })
  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @ApiProperty({
    example: '10',
    description: 'Product Stock',
    default: 0
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['M','XL','XXL'],
    description: 'Product Sizes',
    default: 0
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product gender',
    default: 0
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['shirt'],
    description: 'Product tags',
    default: []
  })
  @Column({
    type : 'text',
    array : true,
    default: []
  })
  tags:string[];

  //Un producto puede tener varias imagenes : One to Many
  @ApiProperty({
    example: ['imagen1', 'imagen2'],
    description: 'Product Images',
    default: []
  })
  //*eager : me permite cargar la relación de manera automatica
  @OneToMany(
    () => ProductImage, (img) => img.product,
    {cascade: true, eager: true}
    
    )
  images?: ProductImage[]
 //* eager : me carga la relación de manera automatica
  @ManyToOne(() => User, (user) => user.product, { eager: true})
    user: User

  //* BeforeInsert : Permite hacer validaciones antes de hacer un insert
  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  //*BeforeUpdate: Pemirte hacer validaciones antes de actualizar
  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
