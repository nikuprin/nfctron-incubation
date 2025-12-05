import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty({ description: 'Full name', example: 'Foo Bar' })
  @IsString()
  @IsOptional()
  readonly name: string;

  @ApiProperty({ description: 'E-mail. Sould be unique.' })
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @ApiProperty({ description: 'Mobile phone number', example: '+420123456789' })
  @IsOptional()
  @IsMobilePhone()
  readonly phone?: string;
}
