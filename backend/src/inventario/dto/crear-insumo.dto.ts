import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { TipoInsumo, UnidadMedida } from '@prisma/client';

export class CrearInsumoDto {
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

