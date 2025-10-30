const Contact = () => {
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <h2 className="section-title">Contáctanos</h2>
        <div className="contact-info">
          <div className="contact-item">
            <h3 className="contact-label">Correo Electrónico</h3>
            <a href="mailto:contacto@apagonrd.com" className="contact-link">
              contacto@apagonrd.com
            </a>
          </div>
          <div className="contact-item">
            <h3 className="contact-label">Teléfono</h3>
            <a href="tel:+18492617198" className="contact-link">
              +1 (849) 261-7198
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
