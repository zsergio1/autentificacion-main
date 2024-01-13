import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';





async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="bg-gray-400 text-white py-6 px-8 flex flex-col md:flex-row justify-between items-center shadow-lg">

      {/* Contenedor principal del navbar en columna */}
      <div className="flex flex-col items-center md:flex-row md:items-center md:w-auto">

        {/* Logo a la izquierda */}
        <div className="flex items-center mb-4 md:mb-0 md:mr-4">
          <img src="/images/logo.jpg" alt="Logo de la Empresa" className="w-13 h-20 rounded-full" />
        </div>
        {/* Nombre de la Empresa con ajustes para evitar superposición con el logo en dispositivos móviles */}
        <div className="absolute top-14 md:top-2 left-1/2 transform -translate-x-1/2"> {/* Ajuste del margen superior para dispositivos móviles */}
          <h1 className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-black 
                sm:text-base md:text-lg lg:text-xl xl:text-2xl"> {/* Ajuste de tamaño de fuente responsivo */}
            COMPANY PRODUCTS
          </h1>
        </div>


      </div>
      <div className="flex items-center space-x-2 md:ml-auto relative">
        <div className="relative">
          <input
            type="text"
            placeholder="¿Qué quieres encontrar?..."
            className="w-48 md:w-96 bg-gray-200 text-gray-900 rounded-md p-1 pl-10 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {/* Ícono de lupa dentro del input */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 z-10">
            <FontAwesomeIcon icon={faSearch} size="sm" />
          </div>
        </div>
      </div>


      {/* Menú de navegación a la derecha */}
      <ul className="flex gap-x-6">
        {!session?.user ? (
          <>
            <NavItem href="/">Catálogo</NavItem>
            <NavItem href="/auth/login">Iniciar sesión </NavItem>
            <NavItem href="/auth/register">Registrarse</NavItem>
          </>
        ) : (
          <>

            <NavItem href="/api/auth/signout">Cerrar sesión</NavItem>
          </>
        )}
      </ul>
    </nav>
  );
}

// Componente auxiliar para los elementos de la lista
function NavItem({ href, children }) {
  return (
    <li className="px-3 py-10">
      <Link href={href}>
        <span className="cursor-pointer hover:text-blue-700 transition duration-300">{children}</span>
      </Link>
    </li>
  );
}

export default Navbar;