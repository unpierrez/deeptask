import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateStatusDTO {
    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    color: string;

    @IsOptional()
    @IsBoolean()
    isDone?: boolean;
}
