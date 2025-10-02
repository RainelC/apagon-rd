import './App.css';
import Navbar from './components/Navbar';
import About from './components/About';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import DownloadLinks from './components/DownloadLinks';
import Footer from './components/Footer';

const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <About />
        <DownloadLinks />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default App;
