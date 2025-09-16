import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, ArrayNotEmpty, ArrayUnique, Min, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'username', description: 'Username for the new user' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'strongpassword123', description: 'Password for the new user' })
  @IsString()
  @IsNotEmpty()
  @Min(6)
  password: string;
}

export class CreateClientDto {
  @ApiProperty({ example: 'My App', description: 'Name of the client application' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: ['https://myapp.com/callback'], description: 'Allowed redirect URIs' })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  redirectUris: string[];

  @ApiProperty({ example: 3600, description: 'Access token lifetime in seconds', required: false, default: 3600 })
  @IsOptional()
  @IsInt()
  @Min(60)
  accessTokenLifetime?: number = 3600;

  @ApiProperty({ example: 1209600, description: 'Refresh token lifetime in seconds', required: false, default: 1209600 })
  @IsOptional()
  @IsInt()
  @Min(60)
  refreshTokenLifetime?: number = 1209600;

  @ApiProperty({ example: ['password', 'authorization_code', 'refresh_token'], description: 'Allowed grant types', required: false, default: ['password', 'authorization_code', 'refresh_token'] })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  grants?: string[] = ['password', 'authorization_code', 'refresh_token'];

  @ApiProperty({ example: ['read', 'write'], description: 'Allowed scopes', required: false, default: ['read', 'write'] })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  scopes?: string[] = ['read', 'write'];
}