const FAQ = () => {
  const faqs = [
    {
      question: "¿Cómo funciona la aplicación?",
      answer: "ApagonRD recibe reportes hechos por nuestros usuarios y los usa para determinar el estado de un sector."
    },
    {
      question: "¿Es gratis?",
      answer: "Sí, ApagonRD es completamente gratuita. Queremos que todos los dominicanos tengan acceso a información vital sobre los cortes de electricidad."
    },
    {
      question: "¿Mis reportes llegaran a la distribuidora de energia correspondiente?",
      answer: "Si, nos encargaremos de hacer llegar los reportes aprobados a la distribuidora de energia que le corresponda al sector."
    },
    {
      question: "¿Funciona en toda la República Dominicana?",
      answer: "No, por ahora solo funciona en parte de Santo Domingo, pero queremos en el futuro expandirnos a todo el pais."
    },
    {
      question: "¿Necesito crear una cuenta?",
      answer: "Si, es necesario registrarse en la aplicación para poder acceder a las funciones que esta ofrece."
    }
  ];

  return (
    <section id="faq" className="section faq">
      <div className="container">
        <h2 className="section-title">Preguntas Frecuentes</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h3 className="faq-question">{faq.question}</h3>
              <p className="faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
