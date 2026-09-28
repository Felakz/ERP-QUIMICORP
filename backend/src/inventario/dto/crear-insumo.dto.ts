import { IsBoolean, IsEnum, IsIn, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { TipoInsumo, UnidadMedida } from '@prisma/client';

export class CrearInsumoDto {
  @IsOptional()
  @IsIn(['GR', 'ML', 'UN'])
  unidadStock?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.000001)
  densidadKgL?: number;

  @IsOptional()
  @IsString()
  fuenteDensidad?: string;
  @IsString()
  codigo: string;

  @IsString()
  nombre: string;

  @IsUUID()
  familiaId: string;

  @IsEnum(UnidadMedida)
  unidadMedida: UnidadMedida;

  @IsOptional()
  @IsEnum(TipoInsumo)
  tipo?: TipoInsumo;

  @IsOptional()
  @IsString()
  estadoFisico?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockMinimo?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costoUnitario?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockInicial?: number;

  @IsOptional()
  @IsBoolean()
  esSoloFormula?: boolean;
}

export class ActualizarInsumoDto {
  @IsOptional()
  @IsIn(['GR', 'ML', 'UN'])
  unidadStock?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.000001)
  densidadKgL?: number;

  @IsOptional()
  @IsString()
  fuenteDensidad?: string;
  @IsOptional()
  @IsString()
  codigo?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsUUID()
  familiaId?: string;

  @IsOptional()
  @IsEnum(UnidadMedida)
  unidadMedida?: UnidadMedida;

  @IsOptional()
  @IsEnum(TipoInsumo)
  tipo?: TipoInsumo;

  @IsOptional()
  @IsString()
  estadoFisico?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockMinimo?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costoUnitario?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockReal?: number;

  @IsOptional()
  @IsBoolean()
  esSoloFormula?: boolean;
}

