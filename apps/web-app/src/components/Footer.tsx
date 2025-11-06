const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">ApagonRD</div>
        <p className="footer-text">
          Manteniéndote informado sobre los cortes de electricidad en República Dominicana
        </p>
        <ul className="footer-links">
          <li><a href="#about" className="footer-link">Acerca de</a></li>
          <li><a href="#faq" className="footer-link">FAQ</a></li>
          <li><a href="#download" className="footer-link">Descargar</a></li>
          <li><a href="#contact" className="footer-link">Contacto</a></li>
        </ul>
        <div className="footer-copyright">
          © {currentYear} ApagonRD. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
