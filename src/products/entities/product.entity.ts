import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: 'bfa87b89-3f19-4fc3-947b-75c39e62028a',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'LG Screen 24F',
    description: 'Product Title',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product Price',
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: 'Lorem ipsum dolor site amet',
    description: 'Product Description',
    default: null,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: 'lg-screen-24-f',
    description: 'Product Slug for SEO',
    uniqueItems: true,
  })
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product Stock',
    default: 0,
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: 'Product Sizes',
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product Gender',
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['tag1', 'tag2', 'tag3'],
    description: 'Product Tags',
  })
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  // images
  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

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

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
