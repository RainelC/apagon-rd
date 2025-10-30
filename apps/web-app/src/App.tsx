import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import FAQ from './components/FAQ';
import DownloadLinks from './components/DownloadLinks';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <About />
      <FAQ />
      <DownloadLinks />
      <Contact />
      <Footer />
    </div>
  );
};

export default App;
