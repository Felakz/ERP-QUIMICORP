import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNumber, IsString, IsUUID, Min, ValidateNested } from 'class-validator';

class DetalleFormulaInputDto {
  @IsUUID()
  insumoId: string;

  @IsNumber()
  @Min(0.001)
  porcentaje: number;
}

export class CrearFormulaDto {
  @IsString()
  codigoFormula: string;

  @IsString()
  nombreProducto: string;

  @IsNumber()
  @Min(0)
  densidadTeorica: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DetalleFormulaInputDto)
  detalles: DetalleFormulaInputDto[];
}
