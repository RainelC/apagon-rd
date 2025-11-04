function Successful() {
  return (
    <div
      id='container'
      className=' h-screen flex p-10 text-center text-green-500'
    >
      <div className='m-auto'>
        <h2 className='scroll-m-20  pb-2 text-3xl font-bold tracking-tight first:mt-0 '>
          ¡Contraseña cambiada correctamente!
        </h2>
        <h4 className='scroll-m-20 text-xl tracking-tight'>
          Ya puedes iniciar sesión en la app con tu nueva contraseña.
        </h4>
        <a
          href='/'
          className='scroll-m-20 text-xl tracking-tight mt-300 text-blue-500'
        >
          Ir al inicio
        </a>
      </div>
    </div>
  )
}

export { Successful }
