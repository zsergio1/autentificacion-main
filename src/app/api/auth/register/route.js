import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP

export async function POST(request) {
  try {
    const data = await request.json();

    // Realiza una solicitud POST a tu API Spring Boot para registrar el usuario
    const response = await axios.post('http://localhost:8080/api/usuarios', {
      username: data.username,
      email: data.email,
      password: data.password,
    });

    // Verifica si la respuesta es exitosa y devuelve los datos del usuario
    if (response && response.data) {
      const user = response.data;
      return NextResponse.json(user);
    } else {
      throw new Error('Error al registrar usuario');
    }
  } catch (error) {
    // Maneja el error y devuelve un mensaje de error adecuado
    console.error('Error al registrar usuario:', error);
    return NextResponse.json(
      {
        message: 'Error al registrar usuario',
      },
      {
        status: 500,
      }
    );
  }
}
