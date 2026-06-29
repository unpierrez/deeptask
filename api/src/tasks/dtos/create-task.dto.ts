import { IsArray, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTaskDTO {
    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    statusId: string;

    @IsOptional()
    @IsIn(['alta', 'media', 'baixa'])
    priority?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @IsOptional()
    @IsString()
    dueDate?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
