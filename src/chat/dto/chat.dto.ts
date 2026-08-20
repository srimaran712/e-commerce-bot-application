import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatDto {
  @IsOptional()
  @IsString()
  sessionId?: string ;

  @IsString()
  @IsNotEmpty()
  message!: string;
}