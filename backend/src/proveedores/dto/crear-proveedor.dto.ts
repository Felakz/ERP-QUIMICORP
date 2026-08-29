import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CuentaBancariaDto {
  @IsString()
  @IsNotEmpty()
  banco: string;

  @IsString()
  @IsNotEmpty()
  moneda: string;

  @IsString()
  @IsNotEmpty()
  numeroCuenta: string;

  @IsString()
  @IsOptional()
  cci?: string;
}

export class CrearProveedorDto {
  @IsString()
  @IsNotEmpty()
  ruc: string;

  @IsString()
  @IsNotEmpty()
  razonSocial: string;

  @IsString()
  @IsOptional()
  contacto?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  correo?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  @IsOptional()
  insumoPrincipal?: string;

  @IsArray()
  @IsOptional()
  cuentasBancarias?: CuentaBancariaDto[];
}
