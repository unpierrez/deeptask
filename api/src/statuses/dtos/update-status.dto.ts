import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateStatusDTO {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  isDone?: boolean;
}
