const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => window.scrollTo(0,0)}>ApagonRD</div>
        <ul className="navbar-menu">
          <li><a href="#about" className="navbar-link">Acerca de</a></li>
          <li><a href="#faq" className="navbar-link">FAQ</a></li>
          <li><a href="#download" className="navbar-link">Descargar</a></li>
          <li><a href="#contact" className="navbar-link">Contactanos</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
