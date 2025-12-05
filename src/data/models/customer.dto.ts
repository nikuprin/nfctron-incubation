import { ApiProperty } from '@nestjs/swagger';
import { Customer } from './customer.interface';
import { IsEmail, IsMobilePhone } from 'class-validator';

export class CustomerDto implements Customer {
  @ApiProperty({
    description: 'Customer ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({ description: 'Full name', example: 'Foo Bar' })
  name: string;

  @ApiProperty({ description: 'E-mail' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Mobile phone number', example: '+420123456789' })
  @IsMobilePhone()
  phone?: string;

  @ApiProperty({ description: 'Timestamp of creation' })
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp of last update' })
  updatedAt?: Date;
}
