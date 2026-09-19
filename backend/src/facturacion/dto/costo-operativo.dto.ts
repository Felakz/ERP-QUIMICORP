import { IsNumber, IsOptional, IsString, Matches, Min } from 'class-validator';

export class CostoOperativoPeriodoDto {
  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/)
  periodo!: string;

  @IsNumber()
  @Min(0)
  cantidadBase!: number;

  @IsNumber()
  @Min(0)
  manoObraLote!: number;

  @IsNumber()
  @Min(0)
  supervisionLote!: number;

  @IsNumber()
  @Min(0)
  depreciacionLote!: number;

  @IsNumber()
  @Min(0)
  energiaLote!: number;

  @IsNumber()
  @Min(0)
  usoLocalLote!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  alquilerMensual?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  energiaMensual?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  horasProductivas?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorMaquinaria?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  depreciacionAnual?: number;
}
