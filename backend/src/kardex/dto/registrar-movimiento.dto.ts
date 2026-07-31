import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { TipoMovimientoKardex } from '@prisma/client';

export class RegistrarMovimientoDto {
  @IsUUID()
  insumoId: string;

  @IsEnum(TipoMovimientoKardex)
  tipoMovimiento: TipoMovimientoKardex;

  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0.0001)
  cantidad: number;

  @IsOptional()
  @IsString()
  documentoReferencia?: string;

  @IsUUID()
  usuarioId: string;
}
