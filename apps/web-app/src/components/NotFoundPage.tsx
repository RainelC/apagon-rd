const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mt-4">Página no encontrada</p>
        <p className="text-md text-gray-500 mt-2">Lo sentimos, la página que buscas no existe.</p>
        <a href="/" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
          Ir a la página de inicio
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
