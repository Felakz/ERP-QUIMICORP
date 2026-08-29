import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class RegistrarAbonoDto {
  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  montoAbonado: number;

  @IsString()
  @IsOptional()
  medio?: string;

  @IsString()
  @IsOptional()
  banco?: string;

  @IsString()
  @IsOptional()
  numOperacion?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
