import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested, IsNotEmpty } from 'class-validator';

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

  @IsOptional()
  @IsString()
  unidadMedida?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.0001)
  pesoNetoKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.000001)
  densidadKgL?: number;

  @IsOptional()
  @IsString()
  fuenteConversion?: string;
}

export class ValidarStockDto {
  @IsString()
  formulaId: string;

  @IsNumber()
  @Min(0.0001)
  cantidadPlanificada: number;

  @IsOptional()
  @IsString()
  unidadMedida?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.0001)
  pesoNetoKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.000001)
  densidadKgL?: number;

  @IsOptional()
  @IsString()
  fuenteConversion?: string;
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

export class ConsumoRealDto {
  @IsUUID() insumoId: string;
  @IsNumber() @Min(0) cantidad: number;
  @IsString() @IsNotEmpty() unidadMedida: string;
  @IsString() @IsNotEmpty() documentoSoporte: string;
}

export class DecidirQADto {
  @IsOptional()
  @IsNumber()
  @Min(0.0001)
  pesoBrutoKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  taraKg?: number;
  @IsString()
  ordenProduccionId: string;

  @IsOptional()
  @IsNumber()
  @Min(0.0001)
  cantidadObtenida?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.0001)
  pesoNetoKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.000001)
  densidadKgL?: number;

  @IsOptional()
  @IsString()
  fuenteConversion?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConsumoRealDto)
  consumosReales?: ConsumoRealDto[];

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
