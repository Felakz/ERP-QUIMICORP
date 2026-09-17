import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { EstadoFormula } from '@prisma/client';

export class DetalleFormulaInputDto {
  @IsOptional()
  @IsUUID()
  insumoId?: string;

  @IsOptional()
  @IsString()
  nombreComponente?: string;

  @IsOptional()
  @IsString()
  skuComponente?: string;

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

  @IsOptional()
  pasosElaboracion?: any;

  @IsOptional()
  @IsEnum(EstadoFormula)
  estado?: EstadoFormula;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DetalleFormulaInputDto)
  detalles: DetalleFormulaInputDto[];
}

