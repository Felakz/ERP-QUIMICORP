import { IsNotEmpty, IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { TipoInsumo } from '@prisma/client';

export class PedidoAditivoDto {
  @IsNotEmpty()
  @IsString()
  insumoId: string;

  @IsOptional()
  @IsEnum(TipoInsumo)
  tipo?: TipoInsumo;

  @IsOptional()
  @IsNumber()
  porcentaje?: number;

  @IsOptional()
  @IsNumber()
  gramosCalculados?: number;
}
