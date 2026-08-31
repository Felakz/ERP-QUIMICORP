import { IsIn, IsISO8601, IsOptional, IsString } from 'class-validator';

export class RegistrarMarcacionDto {
  @IsString()
  dispositivoId: string;

  @IsString()
  codigoBiometrico: string;

  @IsIn(['ENTRADA', 'SALIDA_ALMUERZO', 'RETORNO_ALMUERZO', 'SALIDA'])
  tipoMarcacion: 'ENTRADA' | 'SALIDA_ALMUERZO' | 'RETORNO_ALMUERZO' | 'SALIDA';

  @IsOptional()
  @IsISO8601()
  timestamp?: string;
}

export class VincularUsuarioDto {
  @IsString()
  codigoBiometrico: string;
}
