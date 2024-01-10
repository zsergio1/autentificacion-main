import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios'; // Importa la biblioteca axios para realizar solicitudes HTTP a tu API Spring Boot

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      async authorize(credentials, req) {
        // Realiza una solicitud HTTP POST a tu endpoint de inicio de sesión en Spring Boot
        try {
          const response = await axios.post('http://localhost:8080/api/usuarios/login', {
            email: credentials.email,
            password: credentials.password,
          });

          // Verifica si la respuesta es exitosa y contiene los datos del usuario
          if (response && response.data) {
            const user = response.data;

            // Devuelve los datos del usuario para iniciar sesión
            return {
              id: user.id,
              name: user.username,
              email: user.email,
            };
          } else {
            throw new Error('Error al iniciar sesión');
          }
        } catch (error) {
          // Maneja el error y devuelve un mensaje adecuado
          console.error('Error de inicio de sesión:', error);
          throw new Error('Credenciales incorrectas');
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
