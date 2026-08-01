import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

export interface LoteEstadoActualizadoPayload {
  ordenId: string;
  codigoLote: string;
  clienteNombre: string;
  nuevoEstado: string;
  pasoProceso: string;
  operarios?: string[];
  observaciones?: string;
  timestamp: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProduccionGateway {
  @WebSocketServer()
  server: Server;

  /**
   * Emite en tiempo real a todas las consolas conectadas (ej. Pedidos Admin, Producción QA, Gerencia)
   * el cambio de estado o paso de un lote.
   */
  emitirEstadoActualizado(payload: LoteEstadoActualizadoPayload) {
    if (this.server) {
      this.server.emit('lote:estado_actualizado', payload);
      console.log(`📡 WebSocket emitido [lote:estado_actualizado]: ${payload.codigoLote} -> ${payload.pasoProceso}`);
    }
  }

  @SubscribeMessage('ping_produccion')
  handlePing(@MessageBody() data: any) {
    return { event: 'pong_produccion', data: 'Conexión activa con Producción & QA Gateway' };
  }
}
