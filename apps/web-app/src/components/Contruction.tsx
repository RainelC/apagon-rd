export const Construction = () => {
  return (
    <div className="h-screen flex flex-col  items-center">
      <img src="/background.png" className="w-full absolute h-full object-cover" alt="clouds"/>
      <span role="img" aria-label="emoji thunder" className='text-9xl mt-8 mb-15'>⚡</span>
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#0f766e] z-2">Página en construcción</h1>
      {/* <img src="/inContructionPlaceholder.png" className="w-90 mt-5" alt="In contruction image."/> */}
      <p className="text-xs text-center md:text-base lg:text-xl mt-5 lg:mt-80 md:mt-70 font-bold text-[#0f766e] z-2">
        Estamos arreglando la <b className="text-yellow-400">luz</b> de está página <br></br> tennos un poco de paciencia</p>
    </div>
  );
};
