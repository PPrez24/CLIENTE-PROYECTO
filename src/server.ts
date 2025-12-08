import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import path from 'node:path';
import fs from 'node:fs';
import admin from 'firebase-admin';
import multer from 'multer';
import http from 'node:http';
import { Server as SocketIOServer } from 'socket.io';

const browserDistFolder = path.join(import.meta.dirname, '../browser');
const app = express();
const ADMIN_EMAILS = ['admin@iteso.mx'];

if (process.env['FIREBASE_SERVICE_ACCOUNT_JSON']) {
  try {
    const serviceAccount = JSON.parse(
      process.env['FIREBASE_SERVICE_ACCOUNT_JSON'] as string
    );
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount as any) });
    console.log('firebase-admin inicializado desde FIREBASE_SERVICE_ACCOUNT_JSON');
  } catch (e) {
    console.warn(
      'No se pudo inicializar firebase-admin desde FIREBASE_SERVICE_ACCOUNT_JSON:',
      e
    );
  }
} else if (process.env['GOOGLE_APPLICATION_CREDENTIALS']) {
  try {
    admin.initializeApp();
    console.log('firebase-admin inicializado usando GOOGLE_APPLICATION_CREDENTIALS');
  } catch (e) {
    console.warn('No se pudo inicializar firebase-admin usando GOOGLE_APPLICATION_CREDENTIALS:', e);
  }
}

const angularApp = new AngularNodeAppEngine();

const uploadsRoot = path.join(import.meta.dirname, '../uploads');
if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot, { recursive: true });
}

const avatarsDir = path.join(uploadsRoot, 'profile');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_\-]/g, '');
    cb(null, `${base}_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  })
);

app.use('/uploads', express.static(uploadsRoot));

app.use(express.json());

async function verifyFirebaseToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!admin.apps || admin.apps.length === 0) {
    return next();
  }

  const authHeader = (req.headers.authorization || '') as string;
  let idToken = '';
  if (authHeader.startsWith('Bearer ')) {
    idToken = authHeader.split(' ')[1];
  }

  if (!idToken) return next();

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    (req as any).user = decoded;
    return next();
  } catch (err) {
    console.warn('verifyIdToken falló:', err);
    return next();
  }
}

app.get('/api/verify', verifyFirebaseToken, (req, res) => {
  const user = (req as any).user || null;
  if (!user) {
    return res.status(401).json({ ok: false, message: 'No token provided or invalid' });
  }
  return res.json({ ok: true, uid: user.uid, email: user.email });
});

let io: SocketIOServer;

app.post(
  '/api/upload',
  verifyFirebaseToken,
  upload.single('file'),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ ok: false, message: 'No file provided' });
    }

    const fileUrl = `/uploads/profile/${req.file.filename}`;
    if (io) {
      io.emit('fileUploaded', {
        fileUrl,
        originalName: req.file.originalname,
      });
    }

    return res.json({
      ok: true,
      fileName: req.file.filename,
      fileUrl,
    });
  }
);

app.post(
  '/api/admin/delete-user',
  verifyFirebaseToken,
  async (req: Request, res: Response) => {
    const requester = (req as any).user;
    if (!requester || !requester.email) {
      return res.status(401).json({ ok: false, message: 'No autenticado' });
    }

    const email = (requester.email as string).toLowerCase();
    if (!ADMIN_EMAILS.includes(email)) {
      return res.status(403).json({ ok: false, message: 'No tienes permisos de administrador' });
    }

    const { uid } = req.body as { uid?: string };
    if (!uid) {
      return res.status(400).json({ ok: false, message: 'uid requerido' });
    }

    try {
      await admin.auth().deleteUser(uid);
      console.log(`Usuario Firebase eliminado: ${uid}`);
      return res.json({ ok: true });
    } catch (err) {
      console.error('Error al eliminar usuario en Firebase:', err);
      return res.status(500).json({ ok: false, message: 'Error al eliminar usuario en Firebase' });
    }
  }
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

const server = http.createServer(app);

io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado', socket.id);
  });

  socket.on('profile:updateAvatar', (payload: any) => {
    console.log('profile:updateAvatar', payload);
    socket.broadcast.emit('profileUpdated', {
      type: 'avatar',
      ...payload,
    });
  });

  socket.on('profile:updateData', (payload: any) => {
    console.log('profile:updateData', payload);
    socket.broadcast.emit('profileUpdated', {
      type: 'data',
      ...payload,
    });
  });

  socket.on('activity:created', (activity: any) => {
    console.log('activity:created', activity);
    io.emit('serverBroadcast', {
      type: 'activityCreated',
      activity,
    });
  });

  socket.on('activity:updated', (activity: any) => {
    console.log('activity:updated', activity);
    io.emit('serverBroadcast', {
      type: 'activityUpdated',
      activity,
    });
  });

  socket.on('activity:deleted', (payload: any) => {
    console.log('activity:deleted', payload);
    io.emit('serverBroadcast', {
      type: 'activityDeleted',
      id: payload?.id,
      title: payload?.title,
    });
  });
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;

  server.listen(port, (error?: any) => {
    if (error) {
      throw error;
    }
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);