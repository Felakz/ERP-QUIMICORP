import { IsArray, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CrearOrdenDto {
  @IsString()
  formulaId: string;

  @IsNumber()
  @Min(0.0001)
  cantidadPlanificada: number;

  @IsString()
  supervisorId: string;

  @IsOptional()
  @IsString()
  clienteNombre?: string;
}

export class ValidarStockDto {
  @IsString()
  formulaId: string;

  @IsNumber()
  @Min(0.0001)
  cantidadPlanificada: number;
}

export class RegistrarAjusteFinoDto {
  @IsString()
  ordenProduccionId: string;

  @IsString()
  insumoId: string;

  @IsNumber()
  cantidadAgregada: number;

  @IsOptional()
  @IsString()
  unidadMedida?: string;

  @IsString()
  registradoPorId: string;
}

export class DecidirQADto {
  @IsString()
  ordenProduccionId: string;

  @IsOptional()
  @IsNumber()
  cantidadObtenida?: number;

  @IsOptional()
  @IsString()
  observacionesQA?: string;

  @IsOptional()
  @IsString()
  motivoRechazo?: string;
}

export class AsignarOperariosDto {
  @IsString()
  ordenProduccionId: string;

  @IsArray()
  @IsString({ each: true })
  operarios: string[];
}

export class CambiarPasoDto {
  @IsString()
  ordenProduccionId: string;

  @IsString()
  pasoProceso: string; // 'PENDIENTE_ASIGNACION' | 'ELABORANDO' | 'EN_MUESTREO_QA' | 'LIBERADO_QA'

  @IsOptional()
  @IsString()
  observacionesQA?: string;
}
