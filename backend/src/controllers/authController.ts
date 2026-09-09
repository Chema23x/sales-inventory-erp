import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_fallback';

// Endpoint para registrar un nuevo Administrador
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // 1. Validar que no falten datos
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Todos los campos (email, password, name) son obligatorios' });
      return;
    }

    // 2. Verificar si el correo ya existe en PostgreSQL
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'El correo electrónico ya está registrado' });
      return;
    }

    // 3. Encriptar la contraseña (10 rondas de salt)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Guardar usuario en la base de datos
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // 5. Responder con éxito sin exponer la contraseña
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al registrar usuario' });
  }
};

// Endpoint para el inicio de sesión
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email y contraseña son requeridos' });
      return;
    }

    // 1. Buscar al usuario por correo
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Credenciales incorrectas' });
      return;
    }

    // 2. Comparar la contraseña ingresada con el hash guardado
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciales incorrectas' });
      return;
    }

    // 3. Generar token JWT con vigencia de 24 horas
    const token = jwt.sign(
      { userId: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor al iniciar sesión' });
  }
};
