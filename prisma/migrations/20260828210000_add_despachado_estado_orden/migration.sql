-- Add DESPACHADO value to EstadoOrdenProduccion enum
ALTER TYPE "EstadoOrdenProduccion" ADD VALUE IF NOT EXISTS 'DESPACHADO';
