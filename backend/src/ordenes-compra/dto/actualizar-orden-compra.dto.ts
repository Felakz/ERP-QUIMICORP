import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class ActualizarOrdenCompraItemDto {
  @IsString()
  insumoNombre!: string;

  @IsOptional()
  @IsUUID()
  insumoId?: string;

  @IsOptional()
  @IsUUID()
  familiaId?: string;

  @IsNumber()
  cantidad!: number;

  @IsString()
  unidadMedida!: string;

  @IsNumber()
  precioUnitario!: number;
}

export class ActualizarOrdenCompraDto {
  @IsOptional()
  @IsUUID()
  proveedorId?: string;

  @IsOptional()
  @IsString()
  ruc?: string;

  @IsOptional()
  @IsString()
  proveedorNombre?: string;

  @IsOptional()
  @IsString()
  fechaEntregaEstimada?: string;

  @IsOptional()
  @IsString()
  condicionPago?: string;

  @IsOptional()
  @IsString()
  comprador?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActualizarOrdenCompraItemDto)
  items?: ActualizarOrdenCompraItemDto[];
}
