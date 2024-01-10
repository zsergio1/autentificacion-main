"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import { useDropzone } from 'react-dropzone';

function Products() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/productos')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        console.error('Error al obtener los productos:', error);
      });
  }, []);

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    console.log(`Producto seleccionado: ${productId}`);
  };
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    if (selectedProductId !== null) {
      fetch(`http://localhost:8080/api/productos/${selectedProductId}/upload-image`, {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        const updatedProducts = products.map(product => {
          if (product.id === selectedProductId) {
            return { ...product, fotografia: data.filename };
          }
          return product;
        });
        setProducts(updatedProducts);
      })
      .catch(error => {
        console.error('Error al subir la imagen:', error);
      });
    } else {
      console.error('No se ha seleccionado ningún producto para subir la imagen.');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <section className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-4">
        <div>
          <h1>Productos</h1>
          <table className="min-w-full bg-white text-black mt-4">
            <thead>
              <tr>
                <th>ID</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Garantía</th>
                <th>Color</th>
                <th>Voltaje</th>
                <th>Alto</th>
                <th>Ancho</th>
                <th>Profundidad</th>
                <th>Eficiencia Energética</th>
                <th>Peso</th>
                <th>Fotografía</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} onClick={() => handleProductClick(product.id)}>
                  <td>{product.id}</td>
                  <td>{product.marca}</td>
                  <td>{product.modelo}</td>
                  <td>{product.garantia}</td>
                  <td>{product.color}</td>
                  <td>{product.voltaje}</td>
                  <td>{product.alto}</td>
                  <td>{product.ancho}</td>
                  <td>{product.profundidad}</td>
                  <td>{product.eficienciaEnergetica}</td>
                  <td>{product.peso}</td>
                  <td>
                  <img src={`http://localhost:8080/api/productos/${product.id}/imagen`} alt={product.fotografia} style={{ width: '100px', height: '100px' }} />


                  </td>
                  <td>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>Arrastra y suelta una imagen aquí, o haz clic para seleccionar una</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </section>
  );
}

export default Products;
