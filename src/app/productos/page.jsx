"use client";
import React, { useState, useEffect } from 'react';
import Sidebar from '../dashboard/Sidebar';
import Form from '../productos/form';

function Products() {
  const [productos, setProductos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null); // Puedes usar esto para almacenar el producto que se va a editar


  useEffect(() => {
    // Aquí llamarás a la API para obtener la lista de productos
    fetch('http://localhost:8080/api/productos')
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error al obtener productos:', error));
  }, []); // El array vacío asegura que useEffect se ejecute solo una vez al cargar el componente
  const handleEditClick = (producto) => {
    // Al hacer clic en Editar, establecemos el modo de edición y el producto a editar
    setIsEditing(true);
    setProductToEdit(producto);
};

const handleEditCancel = () => {
    // Al hacer clic en Cancelar, reseteamos el modo de edición y el producto a editar
    setIsEditing(false);
    setProductToEdit(null);
};

const handleProductEdited = () => {
    // Al finalizar la edición o creación, actualizamos la lista de productos
    setIsEditing(false);
    setProductToEdit(null);

    // Puedes volver a cargar la lista de productos aquí si lo prefieres
    fetch('http://localhost:8080/api/productos')
        .then(response => response.json())
        .then(data => setProductos(data))
        .catch(error => console.error('Error al obtener productos:', error));
};
const handleDeleteProduct = (productId) => {
  fetch(`http://localhost:8080/api/productos/${productId}`, {
      method: 'DELETE'
  })
  .then(response => {
      // Verificar si la respuesta es un JSON válido
      if (!response.ok) {
          throw new Error('Error al eliminar el producto');
      }
  })
  .then(data => {
      // Actualiza la lista de productos después de eliminar
      setProductos(prevProductos => prevProductos.filter(producto => producto.id !== productId));
      console.log('Producto eliminado:', data);
  })
  .catch(error => {
      console.error('Error al eliminar el producto:', error);
  });
};

return (
  <div>
      <Sidebar />
      <h2>Listado de Productos</h2>
      <ul>
          <h2>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</h2>
          <Form 
              isEditing={isEditing} 
              productToEdit={productToEdit} 
              onEditCancel={handleEditCancel} 
              onProductEdited={handleProductEdited} 
          />
          {productos.map(producto => (
              <li key={producto.id}>
                  {producto.nombre} - {producto.marca} - S/.{producto.price} - {producto.modelo} - {producto.garantia} - {producto.color} - {producto.voltaje} - {producto.alto} - {producto.ancho} - {producto.profundidad} - {producto.eficienciaEnergetica} - {producto.peso}
                  <button onClick={() => handleEditClick(producto)}>Editar</button>
                  <button onClick={() => handleDeleteProduct(producto.id)}>Eliminar</button>
                  {/* Puedes agregar más detalles según lo que desees mostrar */}
                  <img src={`http://localhost:8080/api/productos/${producto.id}/imagen?t=${Date.now()}`} alt={producto.nombre} />
              </li>
          ))}
      </ul>
  </div>
);
}

export default Products;
