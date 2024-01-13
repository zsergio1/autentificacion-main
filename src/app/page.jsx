"use client";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Link from 'next/link';

function HomePage() {
  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/productos/paginados?page=${page}&size=20`);
        if (!response.ok) throw new Error('No se pudo obtener los productos');

        const data = await response.json();
        setProductos(prevProductos => [...prevProductos, ...data.content]);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchProductos();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      console.log("Scrolling...");
      // Comprobamos si el usuario ha llegado al final de la página
      if (window.innerHeight + window.scrollY + 50 >= document.documentElement.offsetHeight) {
        setIsFetching(true);
      }

      if (window.scrollY <= 50 && page > 0 && !isFetching) {
        // Limpiamos la lista de productos antes de cargar los de la primera página
        setProductos([]); // Limpiamos la lista de productos
        setPage(0); // Establecemos la página a la primera página
        setIsFetching(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching, page]);


  useEffect(() => {
    if (!isFetching) return;

    const fetchMoreProductos = async () => {
      try {
        // Simula una demora de 5 segundos antes de cargar más productos
        setTimeout(async () => {
          const response = await fetch(`http://localhost:8080/api/productos/paginados?page=${page + 1}&size=20`);
          if (!response.ok) throw new Error('No se pudo obtener más productos');

          const newData = await response.json();

          // Si no hay más productos en la respuesta, mostrar un mensaje
          if (newData.content.length === 0) {
            setError('Ya no hay más productos disponibles.');
            setIsLoading(false);
            setIsFetching(false);
            return;
          }

          setProductos(prevProductos => [...prevProductos, ...newData.content]);
          setPage(prevPage => prevPage + 1);
          setIsFetching(false);
        }, 3000); // 3000 milisegundos = 3 segundos
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchMoreProductos();
  }, [isFetching, page]);

  return (
    <div className="bg-gray-100">
      <nav>
        {/* Añadiendo una imagen en lugar del texto "Bienvenidos" */}
        <img src="/images/descuento.png" alt="Bienvenidos" className="w-full" />
      </nav>
      <section className="mt-16 px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {productos.map((producto, index) => (
            <ProductoCard key={`${producto.id}-${index}`} producto={producto} />
          ))}
        </div>
        {isFetching && (
          <div className="flex items-center justify-center mt-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
              <p className="mt-2 text-xl text-blue-500">Cargando productos...</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}


const ProductoCard = ({ producto }) => (
  <Link href={`/producto/${producto.id}`}>
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden w-full border border-gray-300 hover:shadow-xl transition duration-300" style={{ height: '400px' }}> {/* Estableciendo una altura personalizada */}
   {/* Estrella en la parte superior izquierda con color verde y texto "20%" */}
<div className="absolute top-2 left-2 flex items-center justify-center">
  {/* SVG de la estrella */}
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 1l2.598 6.833H19.5l-5.25 4.167 1.966 6.969L10 14.75l-5.216 4.219 1.966-6.969L.5 7.833h6.902L10 1z" clipRule="evenodd" />
  </svg>
  
  {/* Texto "20%" */}
  <span className="text-green-500 font-bold">20%</span>
</div>
      {/* Contenido de la tarjeta */}
      <img
        src={`http://localhost:8080/api/productos/${producto.id}/imagen`}
        alt={producto.modelo}
        className="w-full h-40 object-contain p-2"
      />
      <div className="p-4 flex flex-col justify-between h-full"> {/* Diseño de columna */}
        <div>
          <h2 className="text-base font-semibold mb-1 h-16 flex items-center justify-center"><strong>{producto.nombre}</strong></h2>
          <p className="text-sm text-gray-600">Modelo: {producto.modelo}</p>
          <p className="text-sm text-gray-600">Marca: {producto.marca}</p>
          <p className="text-sm text-gray-600">Garantía: {producto.garantia}</p>
          <p className="text-sm text-gray-600 flex justify-between items-center">
            Precio:
            <span className="text-blue-300 font-bold">S/. {producto.price}</span>
          </p>
          <p className="text-xs text-gray-400 line-through">Precio menos 30% </p>
        </div>
        {/* Botón agregar con fondo rojo */}
        <div className="absolute bottom-4 left-4 right-4"> {/* Posicionando el botón */}
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300">
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  </Link>
);

export default HomePage;

