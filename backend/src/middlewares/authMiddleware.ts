import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_fallback';

// Extendemos la interfaz de Request de Express para poder guardarle los datos del usuario autenticado
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  // 1. Obtener el token del encabezado 'Authorization'
  const authHeader = req.headers['authorization'];
  // El estándar es: "Bearer TOKEN_AQUÍ", así que separamos el string por el espacio
  const token = authHeader && authHeader.split(' ')[1];

  // 2. Si no hay token, bloquear el acceso de inmediato
  if (!token) {
    res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    return;
  }

  try {
    // 3. Verificar si el token es real y no ha expirado usando nuestra firma secreta
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    
    // 4. Inyectar los datos del usuario dentro de la petición para que los controladores sepan quién hace la acción
    req.user = decoded;
    
    // 5. Todo está correcto, dar luz verde para avanzar al siguiente controlador
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};
