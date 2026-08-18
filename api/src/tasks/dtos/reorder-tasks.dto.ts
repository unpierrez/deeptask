import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TaskPositionDTO {
  @IsString()
  id: string;

  @IsString()
  statusId: string;

  @IsNumber()
  position: number;
}

export class ReorderTasksDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskPositionDTO)
  items: TaskPositionDTO[];
}
