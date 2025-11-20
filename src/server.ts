import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
// Load local .env in development. This is server-side only and will populate
// process.env with values from a top-level `.env` file when present.
// In production prefer provider-managed secrets or `GOOGLE_APPLICATION_CREDENTIALS`.
import dotenv from 'dotenv';
dotenv.config();
// cookie-parser removed: this project now uses client-only tokens (no session cookies)
import { join } from 'node:path';
import admin from 'firebase-admin';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();

// Inicializar firebase-admin si se proporciona la credencial en la variable de entorno
// (por ejemplo: en GitHub Actions se puede exportar el JSON en FIREBASE_SERVICE_ACCOUNT_JSON)
if (process.env['FIREBASE_SERVICE_ACCOUNT_JSON']) {
  try {
    const serviceAccount = JSON.parse(process.env['FIREBASE_SERVICE_ACCOUNT_JSON'] as string);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount as any) });
    console.log('firebase-admin inicializado desde FIREBASE_SERVICE_ACCOUNT_JSON');
  } catch (e) {
    console.warn('No se pudo inicializar firebase-admin desde FIREBASE_SERVICE_ACCOUNT_JSON:', e);
  }
} else if (process.env['GOOGLE_APPLICATION_CREDENTIALS']) {
  try {
    // Permitir que la librería use GOOGLE_APPLICATION_CREDENTIALS en entorno
    admin.initializeApp();
    console.log('firebase-admin inicializado usando GOOGLE_APPLICATION_CREDENTIALS');
  } catch (e) {
    console.warn('No se pudo inicializar firebase-admin usando GOOGLE_APPLICATION_CREDENTIALS:', e);
  }
}
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Parse JSON bodies for API endpoints
app.use(express.json());

// Session cookie endpoints removed: the app now uses client-side idTokens stored in localStorage.

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

// Middleware opcional para verificar ID token en endpoints /api
async function verifyFirebaseToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!admin.apps || admin.apps.length === 0) {
    // firebase-admin no inicializado; saltar verificación
    return next();
  }

  const authHeader = (req.headers.authorization || '') as string;
  let idToken = '';
  if (authHeader.startsWith('Bearer ')) {
    idToken = authHeader.split(' ')[1];
  // session cookie logic removed; only check Authorization Bearer header
  }

  if (!idToken) return next();

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    // adjuntar usuario verificado a la request
    (req as any).user = decoded;
    return next();
  } catch (err) {
    console.warn('verifyIdToken falló:', err);
    return next();
  }
}

// Ejemplo de endpoint protegido
app.get('/api/verify', verifyFirebaseToken, (req, res) => {
  const user = (req as any).user || null;
  if (!user) return res.status(401).json({ ok: false, message: 'No token provided or invalid' });
  return res.json({ ok: true, uid: user.uid, email: user.email });
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
