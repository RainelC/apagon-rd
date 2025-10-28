function NotFound() {
  return (
    <div
      id='container'
      className=' h-screen flex p-10 text-center'
    >
      <div className='m-auto'>
        <h2 className='scroll-m-20  pb-2 text-3xl font-bold tracking-tight first:mt-0 '>
          Los siento, está página no está disponible
        </h2>
        <h4 className='scroll-m-20 text-xl tracking-tight'>
          Es posible que el enlace que ha seguido esté roto.
          <a
            href='/'
            className='text-blue-500'
          >
            {' '}
            Ir al inicio
          </a>
        </h4>
      </div>
    </div>
  )
}

export { NotFound }
