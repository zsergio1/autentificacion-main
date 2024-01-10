import { useEffect, useState } from 'react';

function Catalogo() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch('http://localhost:8080/api/productos');
        const datos = await respuesta.json();
        setProductos(datos);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    obtenerProductos();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Bienvenido a la Página Principal (Home)</h1>
      
      <div className="grid grid-cols-3 gap-4">
        {productos.map((producto, index) => (
          <div key={index} className="border p-4">
            <h3 className="text-xl mb-2">{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalogo;
