import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EstadoGenerico } from '@prisma/client';

export class ActualizarUsuarioDto {
  @IsOptional()
  @IsString()
  cargo?: string;

  @IsOptional()
  @IsString()
  rolId?: string;

  @IsOptional()
  @IsString()
  nombres?: string;

  @IsOptional()
  @IsString()
  apellidos?: string;

  @IsOptional()
  @IsString()
  dni?: string;

  @IsOptional()
  @IsString()
  turnoId?: string;

  @IsOptional()
  @IsString()
  sucursalId?: string;

  @IsOptional()
  @IsEnum(EstadoGenerico)
  estado?: EstadoGenerico;
}

export class CrearColaboradorDto {
  @IsNotEmpty()
  @IsString()
  dni: string;

  @IsNotEmpty()
  @IsString()
  nombres: string;

  @IsNotEmpty()
  @IsString()
  apellidos: string;

  @IsOptional()
  @IsString()
  cargo?: string;

  @IsNotEmpty()
  @IsString()
  rolId: string;

  @IsOptional()
  @IsString()
  turnoId?: string;

  @IsOptional()
  @IsString()
  sucursalId?: string;
}
