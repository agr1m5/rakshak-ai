/**
 * Socket.IO Server Configuration.
 *
 * Handles real-time connections between:
 *  1. Local Agent -> Backend (sending findings)
 *  2. Backend -> Client Dashboard (streaming live events, threats, incidents)
 */
import { Server } from 'socket.io';
import { config } from './env.js';

let io = null;

export function initSocketServer(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: [config.clientOrigin, 'http://localhost:5180'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join general updates channel for dashboard
    socket.join('dashboard');

    socket.on('disconnect', (reason) => {
      console.log(`[Socket.IO] Client disconnected (${socket.id}): ${reason}`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error('[Socket.IO] Server not initialized!');
  }
  return io;
}
