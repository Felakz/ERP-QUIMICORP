-- Add ENTREGADO value to EstadoPedidoComercial enum
ALTER TYPE "EstadoPedidoComercial" ADD VALUE IF NOT EXISTS 'ENTREGADO';
