import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { faShoppingCart, faArrowLeft  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductById = async (productId) => {
      try {
        const response = await fetch(`http://localhost:8080/api/productos/${productId}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
      }
    };

    if (id) {
      fetchProductById(id);
    }
  }, [id]);

  const handleGoHomeClick = () => {
    router.push('/');
  };

  if (!product) {
    return <p>Cargando detalles del producto...</p>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
      {/* Encabezado utilizando CSS */}
      <div className="product-header flex justify-between items-center mb-4">
        <button
          onClick={handleGoHomeClick}
          style={{
            backgroundColor: '#D32F2F',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '10px' }} />
        Volver
      </button>
        <h1 style={{ 
          fontSize: '2rem', 
          color: '#1E3A8A', 
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', 
          borderBottom: '2px solid #1E3A8A', 
          paddingBottom: '10px' 
        }}>
          Detalles del Producto
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '6px solid #e0e0e0', padding: '20px', marginTop: '20px' }}>
        <div style={{ marginRight: '100px', padding: '20px' }}>
          <img
            src={`http://localhost:8080/api/productos/${product.id}/imagen`}
            alt={product.nombre}
            style={{ width: '600px', height: '400px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: '0', border: '5px solid #FFA500', padding: '20px' }}>

          
          <p><strong>Marca:</strong> {product.marca}</p>
          <p><strong>Modelo:</strong> {product.modelo}</p>
          <p><strong>Garantía:</strong> {product.garantia}</p>
          <p><strong>Color:</strong> {product.color}</p>
          <p><strong>Voltaje:</strong> {product.voltaje}</p>
          <p><strong>Alto:</strong> {product.alto}</p>
          <p><strong>Ancho:</strong> {product.ancho}</p>
          <p><strong>Profundidad:</strong> {product.profundidad}</p>
          <p><strong>Eficiencia Energética:</strong> {product.eficienciaEnergetica}</p>
          <p><strong>Peso:</strong> {product.peso}</p>
          <p style={{ color: '#333', fontWeight: 'bold', fontSize: '1.2rem' }}>
  Precio del producto: 
  <span style={{ color: 'green', fontSize: '1.5rem' }}>
    S/. {product.price}
  </span>
</p>


          <button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.8s ease-in-out',
              marginTop: '20px'
            }}
            onClick={() => {
              console.log('Producto añadido al carrito');
            }}
          >
           <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: '10px' }} />
          Añadir al carrito
        </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
