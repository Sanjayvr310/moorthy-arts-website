import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import LocationsSection from '@/components/LocationsSection';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <LocationsSection />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
