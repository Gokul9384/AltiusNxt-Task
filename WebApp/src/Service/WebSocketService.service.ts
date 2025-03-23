import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:8000', {
      transports: ['websocket'], // Force WebSocket transport
    });
  
    console.log('WebSocket connection established:', this.socket.connected);    
  
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });
  
    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  
    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }

  onStockUpdate(callback: (data: any) => void) {
    this.socket.on('stockUpdate', (data) => {
      console.log('Received stock update from server:', data); // Log received data
      callback(data);
    });
  } 
}