import { CategoriaAdicional } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class PedidoAdicionalDto {
  @IsEnum(CategoriaAdicional)
  categoria!: CategoriaAdicional;

  @IsOptional()
  @IsUUID()
  insumoId?: string;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsString()
  @IsNotEmpty()
  unidadMedida!: string;

  @IsNumber()
  @Min(0.0001)
  cantidad!: number;

  @IsNumber()
  @Min(0)
  precioUnitarioVenta!: number;
}
