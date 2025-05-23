import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useScroll } from '../context/ScrollContext';
import HeroSection from '../components/HeroSection';
import About from './About';
import Footer from '../components/Footer';

const Home = () => {
  const { scrollTarget, setScrollTarget, setCurrentSection } = useScroll();
  const location = useLocation();

  const aboutRef = useRef(null);
  const heroRef = useRef(null);

  // Scroll to section on page load/navigation
  useEffect(() => {
    if (scrollTarget) {
      const element = document.getElementById(scrollTarget);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setScrollTarget(null); // Clear scroll target after scrolling
      }
    }
  }, [location, scrollTarget, setScrollTarget]);

  // Update current section for highlight or tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrentSection('about');
        }
      },
      { threshold: 0.5 }
    );

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrentSection('home');
        }
      },
      { threshold: 0.5 }
    );

    if (aboutRef.current) observer.observe(aboutRef.current);
    if (heroRef.current) heroObserver.observe(heroRef.current);

    return () => {
      if (aboutRef.current) observer.unobserve(aboutRef.current);
      if (heroRef.current) heroObserver.unobserve(heroRef.current);
    };
  }, [setCurrentSection]);

  return (
    <>
      <section id="home" ref={heroRef}>
        <HeroSection />
      </section>

      <section id="about" ref={aboutRef}>
        <About />
      </section>

      <Footer />
    </>
  );
};

export default Home;
