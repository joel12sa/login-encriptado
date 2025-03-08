// src/app/api/login/route.ts
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
      return NextResponse.json({ success: false, message: 'Nombre de usuario y contraseña son requeridos' }, { status: 400 });
    }

    const userResult = await client.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userResult.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Usuario no encontrado' }, { status: 401 });
    }

    const user = userResult.rows[0];
    const contraseñaValida = await bcrypt.compare(password, user.password);

    if (!contraseñaValida) {
      return NextResponse.json({ success: false, message: 'Contraseña incorrecta' }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: 'Autenticación exitosa' }, { status: 200 });
  } catch (error) {
    console.error('Error al autenticar el usuario:', error);
    return NextResponse.json({ success: false, message: 'Error al autenticar el usuario' }, { status: 500 });
  }
}