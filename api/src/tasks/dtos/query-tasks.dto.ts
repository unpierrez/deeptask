import { IsIn, IsOptional, IsString } from 'class-validator';

export class QueryTasksDTO {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsIn(['alta', 'media', 'baixa'])
  priority?: string;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsIn(['all', 'active', 'done'])
  filter?: 'all' | 'active' | 'done';
}
