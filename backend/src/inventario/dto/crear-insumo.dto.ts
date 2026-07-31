import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { UnidadMedida } from '@prisma/client';

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
  @IsNumber()
  @Min(0)
  stockMinimo?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costoUnitario?: number;
}
