import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
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
}
