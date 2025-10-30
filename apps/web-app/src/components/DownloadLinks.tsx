const DownloadLinks = () => {
  const downloadLink = "https://www.youtube.com/watch?v=SQ05AOMMtOE";

  return (
    <section id="download" className="section download">
      <div className="container">
        <h2 className="section-title">Descarga la App</h2>
        <div className="download-content">
          <p className="download-text">
            Disponible para iOS y Android. Descarga ahora y empieza a estar informado sobre
            los apagones en tu área.
          </p>
          <div className="download-buttons">
            <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="download-button">
              <span className="download-icon">📱</span>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Descargar en</div>
                <div>App Store</div>
              </div>
            </a>
            <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="download-button">
              <span className="download-icon">🤖</span>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Disponible en</div>
                <div>Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadLinks;
