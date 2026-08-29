import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CrearCotizacionDto {
  @IsString()
  @IsNotEmpty()
  proveedorId: string;

  @IsString()
  @IsNotEmpty()
  insumoId: string;

  @IsNumber()
  @IsNotEmpty()
  precioUnitario: number;

  @IsString()
  @IsOptional()
  moneda?: string;

  @IsString()
  @IsOptional()
  unidadMedida?: string;

  @IsString()
  @IsOptional()
  numCotizacion?: string;

  @IsDateString()
  @IsOptional()
  fechaCotizacion?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
