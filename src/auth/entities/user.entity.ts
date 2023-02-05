import { OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    example: 'bfa87b89-3f19-4fc3-947b-75c39e62028a',
    description: 'User ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'rpenya@syntonize.com',
    description: 'user e-mail',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  email: string;

  @ApiProperty({
    example: 'ABc123',
    description: 'User password',
  })
  @Column('text', { select: false })
  password: string;

  @ApiProperty({
    example: 'Rafael',
    description: 'User Name',
  })
  @Column('text')
  fullName: string;

  @ApiProperty({
    example: 'Peña',
    description: 'User Surname',
  })
  @Column('text')
  surName: string;

  @ApiProperty({
    example: '655023656',
    description: 'User Telephone',
  })
  @Column('text')
  telefono: string;

  @ApiProperty({
    example: 'C/Calle 34 45879 Ciudad',
    description: 'User Address',
  })
  @Column('text')
  address: string;

  @ApiProperty({
    example: 'PPJSK896',
    description: 'User PIN',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  create_pin: string;

  @ApiProperty({
    example: 'Aragón',
    description: 'User Comunidad Autónoma',
  })
  @Column('text')
  cc_aa: string;

  @ApiProperty({
    example: 'KJSH9878578',
    description: 'User Card Club',
    uniqueItems: true,
  })
  @Column('text', { unique: true })
  card_club: string;

  @ApiProperty({
    example: true,
    description: 'User Activated',
    default: true,
  })
  @Column('bool', { default: true })
  isActive: boolean;

  @ApiProperty({
    example: ['admin', 'superadmin', 'guest'],
    description: 'User Roles',
    default: ['guest'],
  })
  @Column('text', { array: true, default: ['guest'] })
  roles: string[];

  // @ApiProperty()
  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }
  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    this.checkFieldBeforeInsert();
  }
}
