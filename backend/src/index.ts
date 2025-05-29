import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import https from 'https';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';

import { initSocket, io } from './socket';
import scheduleRoutes from './routes/scheduleRoutes';
import downloadRoutes from './routes/downloadRoutes';
import authRoutes from './routes/authRoutes';
import { initDB } from './database';
import { Schedule, schedules } from './models/scheduleModel';

const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

const app = express();

/* Initialize database tables */
initDB();

/* Create HTTP or HTTPS server */
const server = ENV === 'production'
  ? http.createServer(app)
  : https.createServer(
      {
        key: fs.readFileSync(path.resolve(__dirname, '../certs/key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, '../certs/cert.pem')),
      },
      app
    );

initSocket(server);

/* ---------- uploads dir ---------- */
const uploads = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true });

/* ---------- middleware ---------- */
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploads));

/* ---------- routes ---------- */
app.use('/auth', authRoutes);
app.use('/files', downloadRoutes);
app.use('/schedules', scheduleRoutes);

app.get('/health', (_req, res) => {
  res.send('OK');
});

/* ---------- auto-generator every 10 s ---------- */
setInterval(() => {
  const newItem: Schedule = {
    id: uuid(),
    doctorName: `Auto Dr ${Math.floor(Math.random() * 900 + 100)}`,
    patientName: `Patient ${Math.floor(Math.random() * 900 + 100)}`,
    department: ['Cardiology', 'Neurology', 'Surgery', 'Orthopedics', 'Pediatrics'][
      Math.floor(Math.random() * 5)
    ],
    dateTime: new Date().toISOString(),
  };
  schedules.push(newItem);
  io.emit('new_schedule', newItem);
}, 10000);

server.listen(PORT, () =>
  console.log(`🚀 API running at http://localhost:${PORT}`)
);
