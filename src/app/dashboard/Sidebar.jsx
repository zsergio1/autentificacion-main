// Sidebar.js

import Link from 'next/link';

function Sidebar() {
  return (
    <aside className="bg-gray-800 text-white w-1/4 p-4">
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <ul>
        <li className="mb-2">
          <Link href="/dashboard">Usuarios</Link>
        </li>
        <li className="mb-2">
          <Link href="/productos">Gestionar Productos</Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
