"use client";

import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Sidebar from './Sidebar'; 


function DashboardPage() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({});
  

  useEffect(() => {
    fetch('http://localhost:8080/api/usuarios')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los usuarios');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
      })
      .catch(error => {
        console.error('Error al obtener los usuarios:', error);
      });
  }, []);

  const handleEdit = (userId, userData) => {
    setEditingUserId(userId);
    setUpdatedUserData(userData);
  };

  const handleSave = (userId) => {
    fetch(`http://localhost:8080/api/usuarios/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUserData),
    })
      .then(response => {
        if (response.ok) {
          console.log(`Usuario con ID ${userId} actualizado con éxito`);
          return response.json(); // Si tu backend devuelve el usuario actualizado, puedes manejarlo aquí.
        } else {
          throw new Error('Error al actualizar el usuario');
        }
      })
      .then(updatedUser => {
        // Actualizar el estado local con los datos del usuario actualizado
        setUsers(prevUsers => prevUsers.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        ));
        setEditingUserId(null); // Finalizar la edición
      })
      .catch(error => {
        console.error('Error al actualizar el usuario:', error);
      });
  };


  const handleCancel = () => {
    setEditingUserId(null);
  };

  const handleInputChange = (e, field) => {
    setUpdatedUserData(prevData => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  const handleDelete = (userId) => {
    fetch(`http://localhost:8080/api/usuarios/${userId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        } else {
          throw new Error('Error al eliminar el usuario');
        }
      })
      .catch(error => {
        console.error('Error al eliminar el usuario:', error);
      });
  };

  const renderRow = (user) => {
    if (editingUserId === user.id) {
      return (
        <tr key={user.id} className="bg-gray-100">
          <td className="border px-6 py-4">{user.id}</td>
          <td className="border px-6 py-4">
            <input
              type="text"
              className="border p-2 rounded-md w-full"
              value={updatedUserData.username || user.username}
              onChange={(e) => handleInputChange(e, 'username')}
            />
          </td>
          <td className="border px-6 py-4">
            <input
              type="email"
              className="border p-2 rounded-md w-full"
              value={updatedUserData.email || user.email}
              onChange={(e) => handleInputChange(e, 'email')}
            />
          </td>
          <td className="border px-6 py-4">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mr-2" onClick={() => handleSave(user.id)}>
              Guardar
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md" onClick={handleCancel}>
              Cancelar
            </button>
          </td>
        </tr>
      );
    } else {
      return (
        <tr key={user.id}>
          <td className="border px-6 py-4">{user.id}</td>
          <td className="border px-6 py-4">{user.username}</td>
          <td className="border px-6 py-4">{user.email}</td>
          <td className="border px-6 py-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mr-2" onClick={() => handleEdit(user.id, { username: user.username, email: user.email })}>
              Editar
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md" onClick={() => handleDelete(user.id)}>
              Eliminar
            </button>
          </td>
        </tr>
      );
    }
  };
  
  return (
    <section className="flex h-screen bg-gray-200">
      {/* Utiliza el componente Sidebar en lugar del código del sidebar anterior */}
      <Sidebar />
      {/* Contenido principal */}
      <main className="flex-1 p-6">
        <h1 className="text-5xl mb-8 text-gray-800">Logueado</h1>
  
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl mb-6 text-gray-700">Usuarios Registrados:</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-4 text-left text-gray-600">ID</th>
                <th className="px-6 py-4 text-left text-gray-600">Nombre de Usuario</th>
                <th className="px-6 py-4 text-left text-gray-600">Correo Electrónico</th>
                <th className="px-6 py-4 text-left text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => renderRow(user))}
            </tbody>
          </table>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mt-6" onClick={() => signOut()}>
            Logout
          </button>
        </div>
      </main>
    </section>
  );
}
  
  export default DashboardPage;
  

