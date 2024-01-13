"use client";

import React, { useState, useEffect } from 'react';

function form({ isEditing, productToEdit, onEditCancel, onProductEdited }) {
    const [producto, setProducto] = useState({
        nombre: '',
        marca: '',
        modelo: '',
        garantia: '',
        color: '',
        voltaje: '',
        alto: '',
        ancho: '',
        profundidad: '',
        eficienciaEnergetica: '',
        price: '',
        peso: '',
        fotografia: null
    });
    useEffect(() => {
        // Si estamos editando, cargamos los datos del producto a editar
        if (isEditing && productToEdit) {
            setProducto(productToEdit);
        } else {
            resetForm();  // Resetear el formulario si no se está editando
        }
    }, [isEditing, productToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto(prevProducto => ({
            ...prevProducto,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProducto(prevProducto => ({
            ...prevProducto,
            fotografia: file
        }));
    };
    const resetForm = () => {
        setProducto({
            nombre: '',
            marca: '',
            modelo: '',
            garantia: '',
            color: '',
            voltaje: '',
            alto: '',
            ancho: '',
            profundidad: '',
            eficienciaEnergetica: '',
            price: '',
            peso: '',
            fotografia: null
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const apiUrl = isEditing
                ? `http://localhost:8080/api/productos/${productToEdit.id}`
                : 'http://localhost:8080/api/productos';
    
            const method = isEditing ? 'PATCH' : 'POST';
    
            // Para la solicitud del producto
            const productResponse = await fetch(apiUrl, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: producto.nombre,
                    marca: producto.marca,
                    modelo: producto.modelo,
                    garantia: producto.garantia,
                    color: producto.color,
                    voltaje: producto.voltaje,
                    alto: producto.alto,
                    ancho: producto.ancho,
                    profundidad: producto.profundidad,
                    eficienciaEnergetica: producto.eficienciaEnergetica,
                    price: producto.price,
                    peso: producto.peso
                })
            });
    
            const data = await productResponse.json();
            console.log(`Datos del producto actualizados:`, data);
    
            // Verificar si se proporciona una nueva imagen para subir
            if (producto.fotografia) {
                const formData = new FormData();
                formData.append('file', producto.fotografia);
    
                let uploadUrl;
    
                if (isEditing) {
                    // Si estamos editando, usamos la URL con el ID del producto a editar
                    uploadUrl = `http://localhost:8080/api/productos/${productToEdit.id}/upload-image`;
                } else {
                    // Si estamos creando un nuevo producto, usamos la URL sin ID específico
                    uploadUrl = `http://localhost:8080/api/productos/${data.id}/upload-image`;
                }
    
                try {
                    const uploadResponse = await fetch(uploadUrl, {
                        method: 'POST',
                        body: formData
                    });
    
                    const imageData = await uploadResponse.json();
                    console.log('Imagen cargada:', imageData);
    
                } catch (error) {
                    console.error('Error al cargar el producto o la imagen:', error);
                }
            }
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    
        resetForm();
        // Informamos a la función padre que se ha editado o creado un producto
        onProductEdited();
    };
    


    return (
        <div>
            <h2>{isEditing ? 'Editar Producto' : 'Crear Producto'}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="nombre" value={producto.nombre} onChange={handleChange} placeholder="Nombre del producto" />
                <input type="text" name="marca" value={producto.marca} onChange={handleChange} placeholder="Marca" />
                <input type="text" name="modelo" value={producto.modelo} onChange={handleChange} placeholder="Modelo" />
                <input type="text" name="garantia" value={producto.garantia} onChange={handleChange} placeholder="Garantía (ej. 1 año)" />
                <input type="text" name="color" value={producto.color} onChange={handleChange} placeholder="Color" />
                <input type="text" name="voltaje" value={producto.voltaje} onChange={handleChange} placeholder="Voltaje (ej. 220V)" />
                <input type="text" name="alto" value={producto.alto} onChange={handleChange} placeholder="Alto (en cm)" />
                <input type="text" name="ancho" value={producto.ancho} onChange={handleChange} placeholder="Ancho (en cm)" />
                <input type="text" name="profundidad" value={producto.profundidad} onChange={handleChange} placeholder="Profundidad (en cm)" />
                <input type="text" name="eficienciaEnergetica" value={producto.eficienciaEnergetica} onChange={handleChange} placeholder="Eficiencia energética" />
                <input type="text" name="price" value={producto.price} onChange={handleChange} placeholder="Precio" />
                <input type="text" name="peso" value={producto.peso} onChange={handleChange} placeholder="Peso (en kg)" />
                {/* Aquí se espera que seleccione una imagen */}
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <button type="submit">Guardar Producto</button>
                {isEditing && <button type="button" onClick={onEditCancel}>Cancelar</button>}
            </form>
        </div>
    );
}


export default form;
