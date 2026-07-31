import { IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CrearOrdenDto {
  @IsUUID()
  formulaId: string;

  @IsNumber()
  @Min(0.0001)
  cantidadPlanificada: number;

  @IsUUID()
  supervisorId: string;
}

export class ValidarStockDto {
  @IsUUID()
  formulaId: string;

  @IsNumber()
  @Min(0.0001)
  cantidadPlanificada: number;
}

export class RegistrarAjusteFinoDto {
  @IsUUID()
  ordenProduccionId: string;

  @IsUUID()
  insumoId: string;

  @IsNumber()
  cantidadAgregada: number;

  @IsUUID()
  registradoPorId: string;
}

export class DecidirQADto {
  @IsUUID()
  ordenProduccionId: string;

  @IsOptional()
  @IsNumber()
  cantidadObtenida?: number;
}
