import { IsArray, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateTaskDTO {
    @IsOptional()
    @IsString()
    @MinLength(1)
    title?: string;

    @IsOptional()
    @IsString()
    statusId?: string;

    @IsOptional()
    @IsIn(['alta', 'media', 'baixa'])
    priority?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsString()
    dueDate?: string | null;
}
