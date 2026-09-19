import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearOrdenCompraItemDto {
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

export class CrearOrdenCompraDto {
  @IsOptional()
  @IsUUID()
  proveedorId?: string;

  @IsString()
  ruc!: string;

  @IsString()
  proveedorNombre!: string;

  @IsString()
  fechaEntregaEstimada!: string;

  @IsOptional()
  @IsString()
  condicionPago?: string;

  @IsOptional()
  @IsString()
  comprador?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearOrdenCompraItemDto)
  items!: CrearOrdenCompraItemDto[];
}
