import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class StatusPositionDTO {
  @IsString()
  id: string;

  @IsNumber()
  position: number;
}

export class ReorderStatusesDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatusPositionDTO)
  items: StatusPositionDTO[];
}
