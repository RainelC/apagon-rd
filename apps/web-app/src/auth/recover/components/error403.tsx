function Error403() {
  return (
    <div
      id='container'
      className=' h-screen flex p-10 text-center'
    >
      <div className='m-auto'>
        <h2 className='scroll-m-20  pb-2 text-3xl font-bold tracking-tight first:mt-0 '>
          Enlace de recuperación invalido
        </h2>
        <h4 className='scroll-m-20 text-xl tracking-tight'>
          El enlace para restablecer la contraseña no es
          válido o ha caducado, posiblemente porque ya se
          había utilizado.
        </h4>
        <a href="/auth/recover/send" className='scroll-m-20 text-xl tracking-tight mt-300 text-blue-500'>
          Solicite un nuevo enlace para restablecer la
          contraseña.
        </a>
      </div>
    </div>
  )
}

export { Error403 }
