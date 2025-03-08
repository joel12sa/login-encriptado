import { NextResponse } from 'next/server';
import { Client } from 'pg';
import bcrypt from 'bcryptjs';

const client = new Client({
  user: 'admin',
  host: 'localhost',
  database: 'mydatabase',
  password: 'password',
  port: 5433,
});

client.connect();

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Faltan campos requeridos' }, { status: 400 });
    }

    // Verificar si el usuario ya existe
    const userCheck = await client.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userCheck.rows.length > 0) {
      return NextResponse.json({ message: 'El usuario ya existe' }, { status: 400 });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10); // Generar un "salt"
    const hashedPassword = await bcrypt.hash(password, salt); // Encriptar la contraseña

    // Insertar el nuevo usuario con la contraseña encriptada
    await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);

    return NextResponse.json({ message: 'Usuario registrado con éxito' }, { status: 201 });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    return NextResponse.json({ message: 'Error al registrar el usuario' }, { status: 500 });
  }
}