import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CrearCuentaCobrarDto {
  @IsString()
  @IsNotEmpty()
  codigoDoc: string;

  @IsString()
  @IsOptional()
  clienteId?: string;

  @IsString()
  @IsNotEmpty()
  clienteNombre: string;

  @IsString()
  @IsNotEmpty()
  clienteRuc: string;

  @IsString()
  @IsOptional()
  ordenProd?: string;

  @IsString()
  @IsOptional()
  producto?: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  montoTotal: number;

  @IsString()
  @IsOptional()
  condicionPago?: string;

  @IsNumber()
  @IsOptional()
  diasPlazo?: number;

  @IsDateString()
  @IsOptional()
  fechaEmision?: string;

  @IsDateString()
  @IsOptional()
  fechaVencimiento?: string;

  @IsString()
  @IsOptional()
  medioPago?: string;

  @IsString()
  @IsOptional()
  canalBanco?: string;

  @IsBoolean()
  @IsOptional()
  pagoRecibido?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  montoAbonadoInicial?: number;

  @IsString()
  @IsOptional()
  numOperacion?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}

