import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const trackRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const slideCount = 6; // We have 6 images

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('header');
      const backToTop = document.getElementById('back-to-top');
      if (window.scrollY > 50) {
        header?.classList.add('glass', 'shadow-sm');
        backToTop?.classList.remove('opacity-0', 'invisible');
        backToTop?.classList.add('opacity-100', 'visible');
      } else {
        header?.classList.remove('glass', 'shadow-sm');
        backToTop?.classList.add('opacity-0', 'invisible');
        backToTop?.classList.remove('opacity-100', 'visible');
      }
    };

    window.addEventListener('scroll', handleScroll);

    const ctx = gsap.context(() => {
      // Hero Animation
      const heroTl = gsap.timeline();
      heroTl.from(".hero-elem", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
      });

      // Scroll Reveal Animations
      const revealElements = gsap.utils.toArray('.reveal') as any[];
      revealElements.forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        });
      });

      // Counter Animation
      const counters = document.querySelectorAll('.counter');
      counters.forEach((counter) => {
        const targetAttr = counter.getAttribute('data-target');
        if (!targetAttr) return;
        const target = parseFloat(targetAttr);
        const isInteger = Number.isInteger(target);
        
        gsap.to(counter, {
          scrollTrigger: {
            trigger: counter,
            start: "top 90%",
          },
          innerText: target,
          duration: 2,
          snap: { innerText: isInteger ? 1 : 0.1 },
          ease: "power2.out"
        });
      });
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ctx.revert();
    };
  }, []);

  // Carousel Logic
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }, [currentIndex]);

  useEffect(() => {
    const autoPlayInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideCount);
    }, 5000);

    const carouselContainer = document.getElementById('hero-carousel');
    const handleMouseEnter = () => clearInterval(autoPlayInterval);
    const handleMouseLeave = () => {
      // Handled by interval recreation on unmount/mount
    };

    carouselContainer?.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      clearInterval(autoPlayInterval);
      carouselContainer?.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slideCount);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  const goToSlide = (index) => setCurrentIndex(index);

  const toggleFaq = (e) => {
    const item = e.currentTarget.parentElement;
    if (!item) return;
    
    const isActive = item.classList.contains('active');
    
    // Close all other items
    document.querySelectorAll('.faq-item').forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
        otherItem.querySelector('button')?.setAttribute('aria-expanded', 'false');
      }
    });
    
    // Toggle current item
    item.classList.toggle('active');
    e.currentTarget.setAttribute('aria-expanded', String(!isActive));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="antialiased selection:bg-primary selection:text-white">
      

    {/*  HEADER  */}
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-500" id="header">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-50">
            {/*  SLIM TECH LOGO  */}
            <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-7 h-7 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-primary transition-all duration-700 group-hover:rotate-180">
                        <path d="M12 2L12 2C12 2 4 9 4 14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14C20 9 12 2 12 2Z" />
                        <circle cx="12" cy="14" r="3" />
                        <path d="M12 2V5" />
                    </svg>
                </div>
                <div className="flex flex-col">
                    <span className="font-display font-light text-base tracking-[0.4em] text-dark uppercase leading-none">Aqua<span className="text-primary/60">Vita</span></span>
                </div>
            </div>
            <nav className="hidden md:flex gap-10 text-[11px] font-semibold text-dark/60 tracking-[0.15em] uppercase">
                <a href="#diferenciais" className="hover:text-primary transition-colors">Tecnologia</a>
                <a href="#ozonio" className="hover:text-primary transition-colors">Ozônio</a>
                <a href="#alcalina" className="hover:text-primary transition-colors">Alcalina</a>
                <a href="#sobre" className="hover:text-primary transition-colors">Sobre</a>
            </nav>
            <div className="flex items-center gap-3 md:gap-4">
                <a href="https://wa.me/5554999997286" target="_blank" rel="noopener noreferrer" className="bg-dark text-white px-4 md:px-7 py-2 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-bold hover:bg-primary transition-all duration-300 uppercase tracking-[0.15em] md:tracking-[0.2em] cta-hover">
                    Falar com Especialista
                </a>
                {/* Mobile Menu Toggle */}
                <button 
                    className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    <span className={`block w-5 h-[2px] bg-dark transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
                    <span className={`block w-5 h-[2px] bg-dark transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-5 h-[2px] bg-dark transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
                </button>
            </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-white/98 backdrop-blur-xl z-40 transition-all duration-500 flex flex-col items-center justify-center md:hidden ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <nav className="flex flex-col items-center gap-8 text-sm font-semibold text-dark tracking-[0.2em] uppercase">
                <a href="#diferenciais" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Tecnologia</a>
                <a href="#ozonio" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Ozônio</a>
                <a href="#alcalina" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Alcalina</a>
                <a href="#sobre" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Sobre</a>
            </nav>
        </div>
    </header>

    {/*  HERO SECTION  */}
    <section className="relative min-h-screen flex items-center overflow-hidden pt-32 lg:pt-20 bg-white">
        {/*  Background Decor  */}
        <div className="absolute inset-0 z-0">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                {/*  Text Content  */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <div className="hero-elem inline-block mb-8 px-5 py-2 rounded-full border border-primary/10 bg-primary/5 text-[10px] font-bold tracking-[0.25em] uppercase text-primary">
                        O Futuro da Hidratação
                    </div>
                    <h1 className="hero-elem font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1] mb-10 text-dark">
                        A Essência da Vida,<br /><span className="text-primary/80">em sua Melhor Forma.</span>
                    </h1>
                    <p className="hero-elem text-lg md:text-xl text-dark/50 font-light max-w-2xl lg:mx-0 mx-auto mb-14 leading-relaxed">
                        Purificadores de alta performance que transformam água comum em uma fonte de saúde, vitalidade e longevidade para sua família.
                    </p>
                    <div className="hero-elem flex flex-col sm:flex-row gap-8 justify-center lg:justify-start items-center">
                        <a href="https://wa.me/5554999997286" target="_blank" rel="noopener noreferrer" aria-label="Descobrir o Modelo Ideal" className="bg-primary text-white px-12 py-5 rounded-full font-bold tracking-widest uppercase text-xs cta-hover">
                            Descobrir o Modelo Ideal
                        </a>
                        <a href="#diferenciais" aria-label="Conhecer tecnologia de purificação" className="text-dark/40 hover:text-primary text-[11px] font-bold tracking-[0.2em] uppercase transition-colors border-b border-dark/10 hover:border-primary pb-1">
                            Conhecer Tecnologia
                        </a>
                    </div>
                    
                    {/* Social Proof Badge Premium */}
                    <div className="hero-elem mt-12 inline-flex items-center gap-4 sm:gap-5 bg-white/80 backdrop-blur-xl border border-dark/5 p-2.5 sm:p-3 pr-5 sm:pr-8 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 group cursor-default">
                        <div className="flex -space-x-3 sm:-space-x-4">
                            <img src="https://i.pravatar.cc/100?img=1" alt="Cliente" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] border-white shadow-sm group-hover:scale-105 transition-transform duration-300 delay-75" referrerPolicy="no-referrer" />
                            <img src="https://i.pravatar.cc/100?img=5" alt="Cliente" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] border-white shadow-sm group-hover:scale-105 transition-transform duration-300 delay-100" referrerPolicy="no-referrer" />
                            <img src="https://i.pravatar.cc/100?img=3" alt="Cliente" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] border-white shadow-sm group-hover:scale-105 transition-transform duration-300 delay-150" referrerPolicy="no-referrer" />
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-[3px] border-white bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm z-10 text-white group-hover:scale-105 transition-transform duration-300 delay-200">
                                <span className="text-[10px] sm:text-xs font-bold">+2k</span>
                            </div>
                        </div>
                        <div className="flex flex-col text-left">
                            <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                                <div className="flex gap-0.5 text-yellow-400">
                                    <svg width="12" height="12" className="sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg width="12" height="12" className="sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg width="12" height="12" className="sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg width="12" height="12" className="sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <svg width="12" height="12" className="sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                </div>
                                <span className="text-[9px] sm:text-[10px] font-bold text-dark/40 uppercase tracking-widest">5.0 Google</span>
                            </div>
                            <span className="text-[10px] sm:text-xs font-medium text-dark/70 leading-tight">
                                Mais de <strong className="text-dark font-bold">2.000 famílias</strong><br/>beneficiadas e protegidas.
                            </span>
                        </div>
                    </div>
                </div>

                {/*  Product Image Content  */}
                <div className="w-full lg:w-1/2 hero-elem">
                    <div className="relative">
                        {/*  Decorative elements  */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/5 rounded-full blur-2xl"></div>
                        
                        {/*  Main Image Frame (Carousel)  */}
                        <div className="relative z-10 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl border border-dark/5 bg-light group aspect-[4/5] sm:aspect-square lg:aspect-[4/5] xl:h-[700px]">
                            <div id="hero-carousel" className="relative h-full w-full overflow-hidden">
                                {/*  Track  */}
                                <div id="carousel-track" ref={trackRef} className="flex h-full w-full transition-transform duration-700 ease-in-out">
                                    <img src="https://lh3.googleusercontent.com/p/AF1QipNlEfveuWf2Ss5IuYumk8FJ3FLIpjtGhJW6cZ2X=s1360-w1360-h1020-rw" className="w-full h-full object-contain bg-dark/5 object-center flex-shrink-0" alt="Instalação AquaVita 1" />
                                    <img src="https://lh3.googleusercontent.com/p/AF1QipMmb07QllFr_NKHtPGaou9iBkumiMghVgiGZreI=s1360-w1360-h1020-rw" className="w-full h-full object-contain bg-dark/5 object-center flex-shrink-0" alt="Instalação AquaVita 2" />
                                    <img src="https://lh3.googleusercontent.com/p/AF1QipOx3afzKjS4m5ci6F6zXGLG363ENVJcs8nxeRRM=s1360-w1360-h1020-rw" className="w-full h-full object-contain bg-dark/5 object-center flex-shrink-0" alt="Instalação AquaVita 3" />
                                    <img src="https://lh3.googleusercontent.com/p/AF1QipOid5nkjD9d2XyFMUQC_szPwGL6Oj2LbDZAjzVh=s1360-w1360-h1020-rw" className="w-full h-full object-contain bg-dark/5 object-center flex-shrink-0" alt="Instalação AquaVita 4" />
                                    <img src="https://lh3.googleusercontent.com/p/AF1QipMF3VtiK7Yhb5U64jNrNyPYhhB8dAMw1RPqjCn-=s1360-w1360-h1020-rw" className="w-full h-full object-contain bg-dark/5 object-center flex-shrink-0" alt="Instalação AquaVita 5" />
                                    <img src="https://lh3.googleusercontent.com/p/AF1QipNIjjzov7Im8bAIHhYReaothXFINB-4G8AoHx2_=s1360-w1360-h1020-rw" className="w-full h-full object-contain bg-dark/5 object-center flex-shrink-0" alt="Instalação AquaVita 6" />
                                </div>

                                {/*  Controls  */}
                                <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <button id="prev-slide" onClick={prevSlide} className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-dark shadow-xl pointer-events-auto hover:bg-primary hover:text-white transition-all transform hover:scale-110">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                                    </button>
                                    <button id="next-slide" onClick={nextSlide} className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-dark shadow-xl pointer-events-auto hover:bg-primary hover:text-white transition-all transform hover:scale-110">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                                    </button>
                                </div>

                                {/*  Indicators  */}
                                <div id="carousel-indicators" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                                    {/*  Dots generated by JS  */}
                                </div>
                                
                                {/*  Floating Badge  */}
                                <div className="absolute bottom-8 right-8 glass px-6 py-4 rounded-2xl border border-white/40 shadow-xl backdrop-blur-md z-30 pointer-events-none hidden md:block">
                                    <div className="text-primary font-bold text-[8px] tracking-[0.2em] mb-1 uppercase">Instalação Real</div>
                                    <div className="text-dark font-display font-bold text-sm tracking-tight">Design & Integração</div>
                                </div>
                            </div>
                        </div>

                        {/*  Trust Badge  */}
                        <div className="absolute -top-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-lg border border-dark/5 hidden md:flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-dark leading-none">5.0</span>
                                <span className="text-[8px] text-dark/40 font-bold uppercase tracking-tighter">Avaliações Google</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*  Scroll Indicator  */}
            <div className="hero-elem mt-20 hidden lg:flex flex-col items-center gap-4 opacity-20">
                <span className="text-[8px] uppercase tracking-[0.4em] font-bold">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-dark to-transparent"></div>
            </div>
        </div>
    </section>

    {/*  AUTHORITY MARQUEE  */}
    <div className="py-10 border-y border-dark/5 bg-white relative z-20">
        <div className="marquee-container">
            <div className="marquee-content font-display text-[11px] font-bold tracking-[0.2em] uppercase text-dark/30">
                <span>✦ Especialista Multimarcas</span>
                <span>✦ Hoken • Planeta Água • Ulfer</span>
                <span>✦ Refis para Todas as Marcas</span>
                <span>✦ 5.020+ Avaliações no Google</span>
                <span>✦ Assistência Técnica Completa</span>
            </div>
            <div className="marquee-content font-display text-[11px] font-bold tracking-[0.2em] uppercase text-dark/30" aria-hidden="true">
                <span>✦ Especialista Multimarcas</span>
                <span>✦ Hoken • Planeta Água • Ulfer</span>
                <span>✦ Refis para Todas as Marcas</span>
                <span>✦ 5.020+ Avaliações no Google</span>
                <span>✦ Assistência Técnica Completa</span>
            </div>
        </div>
    </div>

    {/*  DORES (O PESO INVISÍVEL) - PREMIUM DARK SECTION  */}
    <section className="py-32 bg-zinc-950 text-white relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20 reveal">
                <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold tracking-[0.2em] uppercase text-red-400">
                    A Ilusão da Água Tratada
                </div>
                <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
                    O Inimigo Invisível<br />na Sua Torneira
                </h2>
                <p className="text-zinc-400 text-lg font-light max-w-2xl mx-auto">
                    Por que sistemas comuns não protegem mais a sua família.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center mb-10">
                <div className="w-full lg:w-5/12 reveal">
                    <div className="relative max-w-sm mx-auto">
                        {/* Video Glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-orange-500/20 blur-3xl rounded-full transform scale-90"></div>
                        
                        {/* Video Container (Premium Phone/Glass Frame) */}
                        <div className="relative rounded-[2.5rem] overflow-hidden aspect-[9/16] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-black ring-1 ring-white/5 p-2 backdrop-blur-sm">
                            <div className="w-full h-full rounded-[2rem] overflow-hidden relative bg-zinc-900">
                                <iframe 
                                    className="absolute inset-0 w-full h-full" 
                                    src="https://www.youtube.com/embed/yePM4804HG4?controls=1&rel=0&modestbranding=1&playsInline=1&vq=hd1080" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    loading="lazy"
                                    allowFullScreen>
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-7/12 reveal">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Card 1 */}
                        <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-8 backdrop-blur-md hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 group">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 shrink-0 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform duration-500">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l6 0"/><path d="M12 9l0 6"/></svg>
                                </div>
                                <div>
                                    <h3 className="font-display text-xl font-bold mb-2 text-white">O Paradoxo do Cloro</h3>
                                    <p className="text-zinc-400 font-light text-sm leading-relaxed">A reação química nas tubulações gera Trihalometanos (THMs), toxinas invisíveis que a filtragem comum não consegue reter.</p>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 - Highlighted Alert */}
                        <div className="bg-orange-500/[0.05] border border-orange-500/30 rounded-[2rem] p-8 backdrop-blur-md hover:bg-orange-500/[0.08] hover:border-orange-500/50 transition-all duration-500 group relative overflow-hidden shadow-[0_0_30px_rgba(249,115,22,0.05)]">
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-50"></div>
                            <div className="flex items-start gap-6 relative z-10">
                                <div className="w-14 h-14 shrink-0 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(249,115,22,0.3)] animate-[pulse_3s_ease-in-out_infinite]">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-display text-xl font-bold text-orange-50">Alerta Científico</h3>
                                        <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[9px] font-bold uppercase tracking-widest border border-orange-500/30">Atenção</span>
                                    </div>
                                    <p className="text-orange-100/70 font-light text-sm leading-relaxed">Estudos europeus recentes associam o consumo prolongado desses químicos a <strong className="text-orange-200 font-medium">riscos silenciosos e severos</strong> para a saúde a longo prazo.</p>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-8 backdrop-blur-md hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all duration-500 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="flex items-start gap-6 relative z-10">
                                <div className="w-14 h-14 shrink-0 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                                </div>
                                <div>
                                    <h3 className="font-display text-xl font-bold mb-2 text-white">A Solução AquaVita</h3>
                                    <p className="text-zinc-400 font-light text-sm leading-relaxed">Retenção absoluta através de blocos de Carvão Ativado de alta densidade e esterilização orgânica e natural por Ozônio.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/*  DIFERENCIAIS (OS 3 PILARES)  */}
    <section id="diferenciais" className="py-32 bg-light">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 reveal">
                <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6 text-dark">Engenharia da Saúde.</h2>
                <p className="text-dark/40 text-lg font-light max-w-2xl mx-auto">Combinamos as tecnologias mais avançadas do mundo para entregar uma água que não apenas mata a sede, mas cura e protege.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/*  Pureza  */}
                <div className="reveal glass-card rounded-[2.5rem] p-8 md:p-12 group">
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 relative cursor-help">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 shadow-xl">
                            Água 100% livre de impurezas
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-dark rotate-45"></div>
                        </div>
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-4 text-dark">Pureza Absoluta</h3>
                    <p className="text-dark/40 font-light leading-relaxed">Retenção de partículas, cloro e metais pesados através de nanotecnologia de carvão ativado.</p>
                </div>

                {/*  Alcalinidade  */}
                <div className="reveal glass-card rounded-[2.5rem] p-8 md:p-12 group">
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 relative cursor-help">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 shadow-xl">
                            Equilibra o pH do seu corpo
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-dark rotate-45"></div>
                        </div>
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-4 text-dark">Água Alcalina</h3>
                    <p className="text-dark/40 font-light leading-relaxed">Ionização que eleva o pH da água, combatendo a acidez do corpo e o envelhecimento precoce.</p>
                </div>

                {/*  Ozônio  */}
                <div className="reveal glass-card rounded-[2.5rem] p-8 md:p-12 group">
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 relative cursor-help">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/><path d="M7 12l10 0"/><path d="M12 7l0 10"/></svg>
                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 shadow-xl">
                            Elimina bactérias e agrotóxicos
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-dark rotate-45"></div>
                        </div>
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-4 text-dark">Ozônio Ativo</h3>
                    <p className="text-dark/40 font-light leading-relaxed">Esterilização por O₃ que elimina 99.9% de vírus e bactérias, além de remover agrotóxicos.</p>
                </div>
            </div>
        </div>
    </section>

    {/*  ÁGUA ALCALINA (DETALHAMENTO)  */}
    <section id="alcalina" className="py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-6">
            {/*  Text Content First  */}
            <div className="text-center max-w-3xl mx-auto mb-20 reveal">
                <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-[1.1] text-dark">
                    O Equilíbrio que seu<br /><span className="text-dark/30">Corpo Merece.</span>
                </h2>
                <p className="text-dark/50 text-lg font-light leading-relaxed mb-10">
                    Nosso organismo luta diariamente contra a acidez causada pelo estresse e má alimentação. A água alcalina ionizada é a ferramenta definitiva para restaurar sua vitalidade.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                    <div className="glass-card p-6 rounded-3xl border-l-4 border-primary">
                        <h4 className="font-display font-bold text-lg mb-2 text-primary">Equilíbrio Metabólico</h4>
                        <p className="text-xs text-dark/50 font-light leading-relaxed">Auxilia na regulação do pH sanguíneo, otimizando processos enzimáticos e reduzindo a fadiga.</p>
                    </div>
                    <div className="glass-card p-6 rounded-3xl border-l-4 border-dark/10">
                        <h4 className="font-display font-bold text-lg mb-2 text-dark">Poder Antioxidante</h4>
                        <p className="text-xs text-dark/50 font-light leading-relaxed">Combate radicais livres e o envelhecimento precoce através da ionização negativa.</p>
                    </div>
                </div>
            </div>

            {/*  Ultra-Premium Responsive Horizontal pH Scale  */}
            <div className="w-full reveal">
                <div className="mt-16 flex flex-col p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] bg-light border border-dark/5 relative overflow-hidden shadow-sm">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h4 className="font-display font-bold text-3xl md:text-4xl text-dark mb-4">Pilar de Vitalidade</h4>
                        <p className="text-[10px] text-dark/40 uppercase tracking-[0.2em] font-bold mb-6">Monitoramento de pH</p>
                        <p className="text-dark/50 text-base font-light leading-relaxed mb-8">
                            Visualize o espectro da saúde. Enquanto a maioria das águas e bebidas comuns puxam seu corpo para a zona ácida, a AquaVita mantém você na <strong>Zona de Saúde Máxima</strong>.
                        </p>
                    </div>

                    {/*  Horizontal Scale  */}
                    <div className="w-full relative pt-24 pb-32 md:pt-28 md:pb-36 px-4 md:px-8 max-w-5xl mx-auto">
                        
                        {/*  Top Markers (Acidic/Neutral)  */}
                        <div className="absolute top-0 left-[17.85%] -translate-x-1/2 flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity group">
                            <div className="flex flex-col items-center transform group-hover:-translate-y-1 transition-transform">
                                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-dark/80 whitespace-nowrap">Refrigerante</span>
                                <span className="text-[8px] sm:text-[9px] text-red-500 font-bold">pH 3.0</span>
                            </div>
                            <div className="w-px h-8 md:h-12 bg-red-500/30"></div>
                        </div>

                        <div className="absolute top-0 left-[32.13%] -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity group">
                            <div className="flex flex-col items-center transform group-hover:-translate-y-1 transition-transform">
                                <span className="text-[10px] md:text-xs font-bold text-dark/80 whitespace-nowrap">Café</span>
                                <span className="text-[9px] text-yellow-600 font-bold">pH 5.0</span>
                            </div>
                            <div className="w-px h-8 md:h-12 bg-yellow-600/30"></div>
                        </div>

                        <div className="absolute top-0 left-[46.41%] -translate-x-1/2 flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity group">
                            <div className="flex flex-col items-center transform group-hover:-translate-y-1 transition-transform">
                                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-dark/80 whitespace-nowrap">Água Comum</span>
                                <span className="text-[8px] sm:text-[9px] text-green-600 font-bold">pH 7.0</span>
                            </div>
                            <div className="w-px h-8 md:h-12 bg-green-600/30"></div>
                        </div>

                        {/*  The Color Bar  */}
                        <div className="flex w-full h-6 md:h-10 rounded-full overflow-hidden shadow-inner border border-dark/10">
                            <div className="flex-1 bg-[#dc2626]"></div> {/*  1  */}
                            <div className="flex-1 bg-[#ef4444]"></div> {/*  2  */}
                            <div className="flex-1 bg-[#f97316]"></div> {/*  3  */}
                            <div className="flex-1 bg-[#f59e0b]"></div> {/*  4  */}
                            <div className="flex-1 bg-[#eab308]"></div> {/*  5  */}
                            <div className="flex-1 bg-[#fde047]"></div> {/*  6  */}
                            <div className="flex-1 bg-[#22c55e]"></div> {/*  7  */}
                            <div className="flex-1 bg-[#10b981]"></div> {/*  8  */}
                            <div className="flex-1 bg-[#06b6d4]"></div> {/*  9  */}
                            <div className="flex-1 bg-[#0ea5e9]"></div> {/*  10  */}
                            <div className="flex-1 bg-[#3b82f6]"></div> {/*  11  */}
                            <div className="flex-1 bg-[#6366f1]"></div> {/*  12  */}
                            <div className="flex-1 bg-[#8b5cf6]"></div> {/*  13  */}
                            <div className="flex-1 bg-[#a855f7]"></div> {/*  14  */}
                        </div>

                        {/*  Numbers  */}
                        <div className="flex w-full justify-between px-2 md:px-4 mt-3 text-[8px] sm:text-[10px] md:text-xs font-bold text-dark/30">
                            <span className="flex-1 text-center">1</span>
                            <span className="flex-1 text-center">2</span>
                            <span className="flex-1 text-center">3</span>
                            <span className="flex-1 text-center">4</span>
                            <span className="flex-1 text-center">5</span>
                            <span className="flex-1 text-center">6</span>
                            <span className="flex-1 text-center text-dark/60 font-black">7</span>
                            <span className="flex-1 text-center">8</span>
                            <span className="flex-1 text-center text-primary font-black">9</span>
                            <span className="flex-1 text-center">10</span>
                            <span className="flex-1 text-center">11</span>
                            <span className="flex-1 text-center">12</span>
                            <span className="flex-1 text-center">13</span>
                            <span className="flex-1 text-center">14</span>
                        </div>

                        {/*  Bottom Markers  */}
                        <div className="absolute bottom-12 md:bottom-16 left-[10.71%] -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity group">
                            <div className="w-px h-8 md:h-12 bg-red-500/30"></div>
                            <div className="flex flex-col items-center transform group-hover:translate-y-1 transition-transform">
                                <span className="text-[9px] text-red-500 font-bold">pH 2.0</span>
                                <span className="text-[10px] md:text-xs font-bold text-dark/80 whitespace-nowrap">Limão</span>
                            </div>
                        </div>

                        <div className="absolute bottom-12 md:bottom-16 left-[25.00%] -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity group">
                            <div className="w-px h-8 md:h-12 bg-amber-500/30"></div>
                            <div className="flex flex-col items-center transform group-hover:translate-y-1 transition-transform">
                                <span className="text-[9px] text-amber-500 font-bold">pH 4.0</span>
                                <span className="text-[10px] md:text-xs font-bold text-dark/80 whitespace-nowrap">Cerveja</span>
                            </div>
                        </div>

                        <div className="absolute bottom-12 md:bottom-16 left-[39.28%] -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity group">
                            <div className="w-px h-8 md:h-12 bg-yellow-500/30"></div>
                            <div className="flex flex-col items-center transform group-hover:translate-y-1 transition-transform">
                                <span className="text-[9px] text-yellow-500 font-bold">pH 6.0</span>
                                <span className="text-[10px] md:text-xs font-bold text-dark/80 whitespace-nowrap">Carnes / Leite</span>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-[60.69%] -translate-x-1/2 flex flex-col items-center gap-2 z-20">
                            <div className="w-px h-8 md:h-12 bg-primary/40"></div>
                            <div className="p-2 sm:p-3 md:p-4 rounded-2xl bg-white border border-primary/20 shadow-xl backdrop-blur-md group transition-all duration-500 hover:scale-105 text-center min-w-[110px] sm:min-w-[140px]">
                                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse"></div>
                                    <div className="text-primary font-bold text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.2em] uppercase">AquaVita</div>
                                </div>
                                <div className="text-dark font-display font-bold text-lg sm:text-xl md:text-2xl leading-none mb-1">8.5 — 9.5</div>
                                <div className="text-[7px] sm:text-[8px] md:text-[9px] text-dark/50 font-medium uppercase tracking-tighter">Zona de Saúde Máxima</div>
                            </div>
                        </div>

                        <div className="absolute bottom-12 md:bottom-16 left-[74.97%] -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity group">
                            <div className="w-px h-8 md:h-12 bg-indigo-500/30"></div>
                            <div className="flex flex-col items-center transform group-hover:translate-y-1 transition-transform">
                                <span className="text-[9px] text-indigo-500 font-bold">pH 11.0</span>
                                <span className="text-[10px] md:text-xs font-bold text-dark/80 whitespace-nowrap">Vegetais Crus</span>
                            </div>
                        </div>
                        
                        {/*  Acid/Alkaline Background Labels  */}
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 md:-translate-x-8 -rotate-90 text-[8px] font-bold text-red-500 uppercase tracking-widest opacity-50">Ácido</div>
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 md:translate-x-8 -rotate-90 text-[8px] font-bold text-purple-500 uppercase tracking-widest opacity-50">Alcalino</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/*  ÁGUA OZONIZADA (DETALHAMENTO)  */}
    <section id="ozonio" className="py-32 relative overflow-hidden bg-light">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row-reverse gap-20 items-center">
                <div className="w-full lg:w-1/2 reveal">
                    <div className="relative rounded-[2.5rem] overflow-hidden aspect-[9/16] max-w-sm mx-auto border border-dark/5 group shadow-xl bg-black" id="ozonio-video-container">
                        <iframe 
                            className="absolute inset-0 w-full h-full" 
                            src="https://www.youtube.com/embed/SLo_hF_j2FM?autoPlay=1&mute=1&loop=1&playlist=SLo_hF_j2FM&controls=1&rel=0&modestbranding=1&playsInline=1&vq=hd1080" 
                            frameBorder="0" 
                            allow="autoPlay; encrypted-media" 
                            loading="lazy"
                            allowFullScreen>
                        </iframe>
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/10 to-transparent pointer-events-none"></div>
                        
                        {/*  Benefícios em destaque sobre o vídeo  */}
                        <div className="absolute top-6 right-6 flex flex-col gap-3 items-end pointer-events-none">
                            <div className="px-4 py-2 rounded-full glass border border-white/40 text-xs font-bold text-dark shadow-lg flex items-center gap-2 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0891B2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                Elimina 99% das Bactérias
                            </div>
                            <div className="px-4 py-2 rounded-full glass border border-white/40 text-xs font-bold text-dark shadow-lg flex items-center gap-2 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0891B2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                Purificação Ativa
                            </div>
                        </div>

                        <div className="absolute bottom-8 left-8 pointer-events-none">
                            <div className="px-4 py-2 rounded-full bg-primary/90 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-white shadow-lg">Tecnologia O₃</div>
                        </div>
                    </div>
                </div>
                
                <div className="w-full lg:w-1/2 reveal">
                    <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-[1.1] text-dark">
                        O Poder do Oxigênio Ativo<br /><span className="text-dark/30">em sua Cozinha.</span>
                    </h2>
                    <div className="space-y-8">
                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-xl mb-2 text-dark">Escudo Contra Agrotóxicos</h4>
                                <p className="text-dark/50 font-light leading-relaxed">Essencial para famílias e agricultores: o ozônio degrada moléculas de pesticidas e herbicidas presentes na superfície de frutas e vegetais.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.5 2 7a8 8 0 0 1-7 7.93V20a2 2 0 0 1-2 2H9"/></svg>
                            </div>
                            <div>
                                <h4 className="font-display font-bold text-xl mb-2 text-dark">Segurança Alimentar</h4>
                                <p className="text-dark/50 font-light leading-relaxed">Ideal para a higienização de frutas, verduras e carnes. O ozônio remove agrotóxicos e pesticidas da superfície dos alimentos, garantindo uma refeição verdadeiramente limpa.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/*  TABELA COMPARATIVA DE IMPACTO  */}
    <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10 pb-24 md:pb-0">
            <div className="text-center mb-20 reveal">
                <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark">A Escolha Inteligente.</h2>
                <p className="text-dark/50 text-lg font-light max-w-2xl mx-auto">
                    Compare a qualidade da água que você consome hoje com a experiência transformadora da AquaVita.
                </p>
            </div>

            <div className="relative max-w-5xl mx-auto reveal">
                {/*  Background Glow  */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent blur-3xl -z-10 rounded-[3rem]"></div>
                
                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-dark/5 shadow-2xl overflow-hidden">
                    {/*  Header  */}
                    <div className="grid grid-cols-2 md:grid-cols-12 border-b border-dark/5 bg-light/50">
                        <div className="hidden md:flex col-span-4 p-8 items-center">
                            <span className="text-xs font-bold uppercase tracking-widest text-dark/40">Análise Comparativa</span>
                        </div>
                        <div className="col-span-1 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center border-r md:border-r-0 md:border-l border-dark/5">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-dark/5 flex items-center justify-center mb-3 text-dark/40">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            </div>
                            <span className="text-xs md:text-sm font-bold text-dark/60 text-center">Água de Galão</span>
                            <span className="text-[8px] md:text-[10px] text-dark/40 uppercase tracking-widest mt-1 text-center">Padrão Comum</span>
                        </div>
                        <div className="col-span-1 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center bg-dark text-white relative overflow-hidden ring-2 ring-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                            <div className="absolute top-0 inset-x-0 bg-blue-600 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest text-center py-1">ALTA PERFORMANCE</div>
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(8,145,178,0.4)_0%,transparent_70%)] mt-4"></div>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 flex items-center justify-center mb-3 text-primary relative z-10 border border-primary/30 mt-4">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                            </div>
                            <span className="text-xs md:text-sm font-bold relative z-10 text-center">AquaVita Premium</span>
                            <span className="text-[8px] md:text-[10px] text-primary uppercase tracking-widest mt-1 font-bold relative z-10 text-center">Tecnologia Avançada</span>
                        </div>
                    </div>

                    {/*  Rows  */}
                    <div className="divide-y divide-dark/5">
                        {/*  Row 1  */}
                        <div className="grid grid-cols-2 md:grid-cols-12 group hover:bg-light/50 transition-colors duration-300">
                            <div className="col-span-2 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col justify-center border-b md:border-b-0 border-dark/5 bg-light/30 md:bg-transparent">
                                <span className="text-sm font-bold text-dark mb-1">Nível de pH</span>
                                <span className="text-xs text-dark/40 font-light leading-relaxed">Impacto direto no equilíbrio do organismo e imunidade.</span>
                            </div>
                            <div className="col-span-1 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center border-r md:border-r-0 md:border-l border-dark/5 text-center">
                                <span className="text-xs font-medium text-dark/60 mb-2">Ácido ou Neutro</span>
                                <div className="px-2 md:px-3 py-1 rounded-full bg-red-50 text-red-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest border border-red-100">pH 5.0 a 7.0</div>
                            </div>
                            <div className="col-span-1 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center bg-primary/[0.02] md:border-l border-primary/10 relative text-center ring-2 ring-blue-500/50 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                                <div className="hidden md:block absolute inset-y-0 left-0 w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>
                                <span className="text-xs font-bold text-primary mb-2">Alcalino Medicinal</span>
                                <div className="px-2 md:px-3 py-1 rounded-full bg-primary text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20">pH 8.5 a 9.5</div>
                            </div>
                        </div>

                        {/*  Row 2  */}
                        <div className="grid grid-cols-2 md:grid-cols-12 group hover:bg-light/50 transition-colors duration-300">
                            <div className="col-span-2 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col justify-center border-b md:border-b-0 border-dark/5 bg-light/30 md:bg-transparent">
                                <span className="text-sm font-bold text-dark mb-1">Pureza e Filtragem</span>
                                <span className="text-xs text-dark/40 font-light leading-relaxed">Capacidade de retenção de partículas e contaminantes químicos.</span>
                            </div>
                            <div className="col-span-1 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center border-r md:border-r-0 md:border-l border-dark/5 text-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-dark/30 mb-2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                                <span className="text-xs font-medium text-dark/60">Básica</span>
                                <span className="text-[9px] md:text-[10px] text-dark/40 mt-1">Risco de Microplásticos</span>
                            </div>
                            <div className="col-span-1 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center bg-primary/[0.02] md:border-l border-primary/10 relative text-center ring-2 ring-blue-500/50 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                                <div className="hidden md:block absolute inset-y-0 left-0 w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mb-2"><path d="M20 6 9 17l-5-5"/></svg>
                                <span className="text-xs font-bold text-dark">Nanotecnologia</span>
                                <span className="text-[9px] md:text-[10px] text-primary mt-1 font-medium">Carvão Ativado + Prata</span>
                            </div>
                        </div>

                        {/*  Row 3  */}
                        <div className="grid grid-cols-2 md:grid-cols-12 group hover:bg-light/50 transition-colors duration-300">
                            <div className="col-span-2 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col justify-center border-b md:border-b-0 border-dark/5 bg-light/30 md:bg-transparent">
                                <span className="text-sm font-bold text-dark mb-1">Esterilização Ativa</span>
                                <span className="text-xs text-dark/40 font-light leading-relaxed">Eliminação de vírus, bactérias e agrotóxicos nos alimentos.</span>
                            </div>
                            <div className="col-span-1 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center border-r md:border-r-0 md:border-l border-dark/5 text-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-dark/30 mb-2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                                <span className="text-xs font-medium text-dark/60">Inexistente</span>
                                <span className="text-[9px] md:text-[10px] text-dark/40 mt-1">Depende da fonte</span>
                            </div>
                            <div className="col-span-1 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center bg-primary/[0.02] md:border-l border-primary/10 relative text-center ring-2 ring-blue-500/50 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                                <div className="hidden md:block absolute inset-y-0 left-0 w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mb-2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                <span className="text-xs font-bold text-dark">Gás Ozônio (O₃)</span>
                                <span className="text-[9px] md:text-[10px] text-primary mt-1 font-medium">Elimina 99.9% das bactérias</span>
                            </div>
                        </div>

                        {/*  Row 4  */}
                        <div className="grid grid-cols-2 md:grid-cols-12 group hover:bg-light/50 transition-colors duration-300">
                            <div className="col-span-2 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col justify-center border-b md:border-b-0 border-dark/5 bg-light/30 md:bg-transparent">
                                <span className="text-sm font-bold text-dark mb-1">Praticidade Diária</span>
                                <span className="text-xs text-dark/40 font-light leading-relaxed">Esforço necessário para ter água disponível em casa.</span>
                            </div>
                            <div className="col-span-1 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center border-r md:border-r-0 md:border-l border-dark/5 text-center">
                                <span className="text-xs font-medium text-dark/60 mb-1">Baixa</span>
                                <span className="text-[9px] md:text-[10px] text-dark/40">Carregar 20kg, agendar entregas</span>
                            </div>
                            <div className="col-span-1 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center bg-primary/[0.02] md:border-l border-primary/10 relative text-center ring-2 ring-blue-500/50 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                                <div className="hidden md:block absolute inset-y-0 left-0 w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>
                                <span className="text-xs font-bold text-dark mb-1">Máxima</span>
                                <span className="text-[9px] md:text-[10px] text-primary font-medium">Água contínua e gelada 24h</span>
                            </div>
                        </div>

                        {/*  Row 6 (New)  */}
                        <div className="grid grid-cols-2 md:grid-cols-12 group hover:bg-light/50 transition-colors duration-300">
                            <div className="col-span-2 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col justify-center border-b md:border-b-0 border-dark/5 bg-light/30 md:bg-transparent">
                                <span className="text-sm font-bold text-dark mb-1">Bio-disponibilidade</span>
                                <span className="text-xs text-dark/40 font-light leading-relaxed">Velocidade de absorção da água pelas células do corpo.</span>
                            </div>
                            <div className="col-span-1 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center border-r md:border-r-0 md:border-l border-dark/5 text-center">
                                <span className="text-xs font-medium text-dark/60 mb-1">Lenta</span>
                                <span className="text-[9px] md:text-[10px] text-dark/40">Clusters grandes (12-15 moléculas)</span>
                            </div>
                            <div className="col-span-1 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center bg-primary/[0.02] md:border-l border-primary/10 relative text-center ring-2 ring-blue-500/50 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                                <div className="hidden md:block absolute inset-y-0 left-0 w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>
                                <span className="text-xs font-bold text-dark mb-1">Hidratação Molecular 3x mais rápida</span>
                                <span className="text-[9px] md:text-[10px] text-primary font-medium">Micro-clusters (5-6 moléculas)</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-12 group hover:bg-light/50 transition-colors duration-300">
                            <div className="col-span-2 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col justify-center border-b md:border-b-0 border-dark/5 bg-light/30 md:bg-transparent">
                                <span className="text-sm font-bold text-dark mb-1">Custo por Litro</span>
                                <span className="text-xs text-dark/40 font-light leading-relaxed">Impacto financeiro a médio e longo prazo.</span>
                            </div>
                            <div className="col-span-1 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center border-r md:border-r-0 md:border-l border-dark/5 text-center">
                                <span className="text-lg font-bold text-dark/40 line-through decoration-red-400/50 mb-1">R\$ 1,20</span>
                                <span className="text-[8px] md:text-[10px] text-dark/40 uppercase tracking-widest">Gasto Contínuo Alto</span>
                            </div>
                            <div className="col-span-1 md:col-span-4 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center bg-primary/[0.02] md:border-l border-primary/10 relative text-center ring-2 ring-blue-500/50 shadow-[0_0_30px_rgba(37,99,235,0.1)]">
                                <div className="hidden md:block absolute inset-y-0 left-0 w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>
                                <span className="text-2xl font-black text-primary mb-1">R\$ 0,02</span>
                                <span className="text-[8px] md:text-[10px] text-primary font-bold uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">Economia de até 98%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center reveal">
                <p className="text-dark/30 text-[10px] uppercase font-bold tracking-[0.2em] mb-8">Investimento em Saúde com Retorno Financeiro</p>
                <a href="https://wa.me/5554999997286" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 bg-dark text-white px-10 py-4 rounded-full font-bold tracking-widest uppercase text-[10px] cta-hover">
                    Receber Orçamento pelo WhatsApp
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
            </div>
        </div>

        {/*  Decorative background element  */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
    </section>

    {/*  ESPECIALIDADES TECNOLÓGICAS (OPÇÕES DE COMPRA)  */}
    <section id="modelos" className="py-32 relative overflow-hidden bg-[#F8FAFC]">
        {/*  Decorative background blobs for glassmorphism refraction  */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[70%] rounded-full bg-primary/5 blur-3xl"></div>
            <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[50%] rounded-full bg-blue-100/40 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20 reveal">
                <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6 text-dark">Tecnologia sob Medida.</h2>
                <p className="text-dark/50 text-lg font-light max-w-2xl mx-auto">
                    Escolha a tecnologia ideal para sua saúde. Oferecemos as melhores soluções das marcas <strong>Hoken, Planeta Água e Ulfer</strong>.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/*  Linha Alcalina  */}
                <div className="reveal bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/30 hover:shadow-[0_20px_40px_rgb(8,145,178,0.08)] hover:-translate-y-2 transition-all duration-500">
                    <div className="mb-8 relative">
                        <img src="https://image.pollinations.ai/prompt/A%20cinematic%20and%20bright%20close-up%20of%20a%20luxury%20crystal%20glass%20being%20filled%20with%20perfectly%20crystalline%20water.%20Minimalist%20clean%20white%20studio%20background.%20The%20water%20has%20a%20subtle%20sapphire-blue%20glow%20and%20many%20visible%20microbubbles%2C%20conveying%20alkaline%20ionized%20water%20and%20deep%20hydration.%20Soft%20natural%20lighting.?width=1200&height=675&nologo=true" alt="Água Alcalina" className="w-full h-48 object-cover rounded-2xl mb-8 shadow-inner" referrerPolicy="no-referrer" />
                        <span className="px-4 py-1 rounded-full bg-dark/5 border border-dark/10 text-[10px] uppercase tracking-widest text-dark/40">Especialidade 01</span>
                        <h3 className="font-display text-4xl font-bold mt-4 mb-2 text-dark">Linha Alcalina</h3>
                        <p className="text-dark/40 text-sm italic">Equilíbrio Mineral e Hidratação Celular</p>
                    </div>
                    <p className="text-dark/60 mb-8 font-light">Sistemas de alta performance que elevam o pH da água, tornando-a um poderoso antioxidante natural.</p>
                    <ul className="space-y-4 mb-12">
                        <li className="flex items-center gap-3 text-dark/70">
                            <svg className="text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                            Disponível em: Hoken, Planeta Água e Ulfer
                        </li>
                        <li className="flex items-center gap-3 text-dark/70">
                            <svg className="text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                            Água com pH entre 8.5 e 9.5
                        </li>
                        <li className="flex items-center gap-3 text-dark/70">
                            <svg className="text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                            Rica em Magnésio, Cálcio e Potássio
                        </li>
                        <li className="flex items-center gap-3 text-dark/70">
                            <svg className="text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                            Combate a acidez e o envelhecimento precoce
                        </li>
                    </ul>
                    <a href="https://wa.me/5554999997286" target="_blank" rel="noopener noreferrer" className="block text-center py-4 rounded-full border border-dark/10 hover:bg-dark hover:text-white transition-all duration-300 font-medium tracking-widest uppercase text-xs">Ver Modelos no WhatsApp</a>
                </div>

                {/*  Linha Ozônio  */}
                <div className="reveal bg-gradient-to-br from-white/70 to-primary/10 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-primary/40 hover:shadow-[0_20px_40px_rgb(8,145,178,0.12)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-6 right-8">
                        <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-widest">Mais Procurada</span>
                    </div>
                    <div className="mb-8 relative">
                        <img src="https://image.pollinations.ai/prompt/A%20sharp%20macro%20close-up%20of%20vibrant%20fresh%20fruits%20strawberries%20and%20blueberries%20being%20immersed%20in%20a%20glass%20fruit%20bowl%20with%20water.%20Luxury%20clean%20modern%20kitchen%20background.%20Effervescent%20ozone%20water%20with%20many%20active%20white%20microbubbles%20surrounding%20the%20fruits%2C%20removing%20impurities.%20Clean%20studio%20lighting%2C%20conveying%20food%20safety%20and%20O3%20sterilization.?width=1200&height=675&nologo=true" alt="Água com Ozônio" className="w-full h-48 object-cover bg-dark/5 rounded-2xl mb-8 shadow-inner" referrerPolicy="no-referrer" />
                        <span className="px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] uppercase tracking-widest text-primary">Especialidade 02</span>
                        <h3 className="font-display text-4xl font-bold mt-4 mb-2 text-dark">Linha Ozônio</h3>
                        <p className="text-dark/40 text-sm italic">Esterilização e Segurança Alimentar</p>
                    </div>
                    <p className="text-dark/60 mb-8 font-light">Tecnologia de oxigênio ativo (O₃) para quem busca o máximo em pureza e higienização total.</p>
                    <ul className="space-y-4 mb-12">
                        <li className="flex items-center gap-3 text-dark/70">
                            <svg className="text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                            Disponível em: Hoken e Ulfer
                        </li>
                        <li className="flex items-center gap-3 text-dark/70">
                            <svg className="text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                            Elimina 99.9% de vírus e bactérias
                        </li>
                        <li className="flex items-center gap-3 text-dark/70">
                            <svg className="text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                            Remove agrotóxicos de frutas e verduras
                        </li>
                        <li className="flex items-center gap-3 text-dark/70">
                            <svg className="text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                            Ação bactericida 3.000x mais rápida que o cloro
                        </li>
                    </ul>
                    <a href="https://wa.me/5554999997286" target="_blank" rel="noopener noreferrer" className="block text-center py-4 rounded-full bg-dark text-white hover:bg-primary transition-all duration-300 font-bold tracking-widest uppercase text-xs">Ver Modelos no WhatsApp</a>
                </div>
            </div>
        </div>
    </section>

    {/*  SOBRE / NOSSA ESSÊNCIA (OTIMIZADA PARA PC E MOBILE)  */}
    <section id="sobre" className="py-32 relative border-b border-dark/5 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center reveal">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold tracking-[0.2em] uppercase text-primary">
                Nossa Essência
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-8 leading-[1.1] text-dark">
                Sua Solução Completa<br />em Purificação.
            </h2>
            <div className="space-y-6 text-dark/50 font-light text-lg leading-relaxed">
                <p>
                    A AquaVita é referência em hidratação inteligente, oferecendo as melhores marcas do mercado como <strong>Hoken, Planeta Água e Ulfer</strong>. Nossa missão é garantir que sua família tenha acesso à água da mais alta qualidade, independente do seu equipamento.
                </p>
                <p>
                    Além da venda de purificadores premium, somos especialistas em <strong>peças, acessórios e refis para todas as marcas do mercado</strong>. Atendemos toda a região Noroeste do Rio Grande do Sul com assistência técnica ágil e peças originais para manter seu sistema sempre perfeito.
                </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-12 mt-16">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-11 11-3-3"/></svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-dark/60">Multimarcas</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-11 11-3-3"/></svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-dark/60">Peças Originais</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-11 11-3-3"/></svg>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-dark/60">Assistência Técnica</span>
                </div>
            </div>
        </div>
    </section>

    {/*  INSTALAÇÃO PREMIUM  */}
    <section id="instalacao" className="py-32 relative bg-dark text-white overflow-hidden">
        {/*  Decorative background elements  */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]"></div>
            <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
                
                {/*  Text Content  */}
                <div className="w-full lg:w-1/2 reveal">
                    <span className="px-4 py-1 rounded-full bg-primary/20 border border-primary/30 text-[10px] uppercase tracking-widest text-primary font-bold mb-6 inline-block">Serviço Exclusivo</span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
                        Instalação Premium<br /><span className="text-white/40">Sem Dor de Cabeça.</span>
                    </h2>
                    <p className="text-white/60 text-lg font-light leading-relaxed mb-10">
                        Não se preocupe com a obra ou sujeira. Nossa equipe técnica especializada entrega seu purificador funcionando perfeitamente, com uma instalação limpa, rápida e de alto padrão.
                    </p>
                    
                    <div className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary mt-1">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-1">Técnicos Especializados</h4>
                                <p className="text-white/50 text-sm font-light">Profissionais uniformizados, treinados e extremamente cuidadosos com a sua casa.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary mt-1">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg mb-1">Acabamento Impecável</h4>
                                <p className="text-white/50 text-sm font-light">Furação precisa, sem fios aparentes e integração perfeita com a sua bancada ou parede.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  Video Container  */}
                <div className="w-full lg:w-1/2 reveal">
                    <div className="relative rounded-[2.5rem] overflow-hidden aspect-[9/16] max-w-sm mx-auto border border-white/10 group shadow-2xl bg-black">
                        <iframe 
                            className="absolute inset-0 w-full h-full" 
                            src="https://www.youtube.com/embed/_ukGFm9lfPw?autoPlay=1&mute=1&loop=1&playlist=_ukGFm9lfPw&controls=1&rel=0&modestbranding=1&playsInline=1&vq=hd1080" 
                            frameBorder="0" 
                            allow="autoPlay; encrypted-media" 
                            loading="lazy"
                            allowFullScreen>
                        </iframe>
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent pointer-events-none"></div>
                        
                        <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center text-primary animate-pulse">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Instalação Real</p>
                                    <p className="text-white/60 text-xs">Padrão AquaVita</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    {/*  PROCESSO SIMPLIFICADO (PARA LEIGOS E PESSOAS OCUPADAS)  */}
    <section className="py-24 bg-light border-y border-dark/5">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="flex flex-col items-center text-center reveal">
                    <div className="w-12 h-12 rounded-full bg-dark text-white flex items-center justify-center font-display font-bold mb-6">01</div>
                    <h5 className="font-display font-bold text-lg mb-2">Consultoria Grátis</h5>
                    <p className="text-xs text-dark/40 font-light">Analisamos sua necessidade e indicamos a melhor tecnologia.</p>
                </div>
                <div className="flex flex-col items-center text-center reveal">
                    <div className="w-12 h-12 rounded-full bg-dark text-white flex items-center justify-center font-display font-bold mb-6">02</div>
                    <h5 className="font-display font-bold text-lg mb-2">Instalação Ágil</h5>
                    <p className="text-xs text-dark/40 font-light">Técnicos especialistas instalam sem sujeira em sua residência.</p>
                </div>
                <div className="flex flex-col items-center text-center reveal">
                    <div className="w-12 h-12 rounded-full bg-dark text-white flex items-center justify-center font-display font-bold mb-6">03</div>
                    <h5 className="font-display font-bold text-lg mb-2">Saúde Vitalícia</h5>
                    <p className="text-xs text-dark/40 font-light">Acompanhamento preventivo para sua água estar sempre perfeita.</p>
                </div>
            </div>
        </div>
    </section>

    {/*  BENEFÍCIOS BIOLÓGICOS (PROVA SOCIAL EM NÚMEROS)  */}
    <section className="py-20 bg-primary/[0.02] border-y border-dark/5">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 text-center">
                <div className="reveal">
                    <h4 className="font-display font-bold text-3xl mb-1 text-dark"><span className="counter" data-target="99.9">0</span>%</h4>
                    <p className="text-[10px] text-dark/40 uppercase tracking-[0.2em] font-bold">Esterilização</p>
                </div>
                <div className="reveal">
                    <h4 className="font-display font-bold text-3xl mb-1 text-dark"><span className="counter" data-target="9.5">0</span></h4>
                    <p className="text-[10px] text-dark/40 uppercase tracking-[0.2em] font-bold">pH Alcalino</p>
                </div>
                <div className="reveal">
                    <h4 className="font-display font-bold text-3xl mb-1 text-dark"><span className="counter" data-target="6">0</span>x</h4>
                    <p className="text-[10px] text-dark/40 uppercase tracking-[0.2em] font-bold">Mais Hidratação</p>
                </div>
                <div className="reveal">
                    <h4 className="font-display font-bold text-3xl mb-1 text-dark"><span className="counter" data-target="12">0</span></h4>
                    <p className="text-[10px] text-dark/40 uppercase tracking-[0.2em] font-bold">Meses de Garantia</p>
                </div>
            </div>
        </div>
    </section>

    {/*  DEPOIMENTOS  */}
    <section id="depoimentos" className="py-32 relative bg-light">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(8,145,178,0.03)_0%,transparent_70%)]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20 reveal">
                <div className="flex flex-col items-center justify-center mb-12">
                    <div className="font-display text-6xl md:text-8xl font-black text-primary mb-2 flex items-center tracking-tighter">
                        +<span className="counter" data-target="2000">0</span>
                    </div>
                    <div className="text-dark/40 uppercase tracking-[0.3em] font-bold text-xs md:text-sm">Famílias Beneficiadas</div>
                </div>

                <div className="inline-flex items-center justify-center gap-2 mb-6">
                    <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="font-bold text-dark text-xl">Avaliações do Google</span>
                </div>
                <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark">A Voz da Experiência.</h2>
                <p className="text-dark/50 text-lg font-light max-w-2xl mx-auto">
                    Junte-se a milhares de pessoas que já transformaram a saúde de quem amam. O impacto real na vida de quem escolheu investir no que há de melhor.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/*  Google Review 1  */}
                <div className="reveal bg-white p-8 rounded-[2rem] shadow-sm border border-dark/5 flex flex-col h-full hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                G
                            </div>
                            <div>
                                <div className="font-bold text-dark text-sm">Gilvani Eichelberger</div>
                                <div className="text-[10px] text-dark/40">Avaliação verificada</div>
                            </div>
                        </div>
                        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    </div>
                    <div className="flex gap-1 mb-4">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </div>
                    <p className="text-sm font-light leading-relaxed text-dark/80 flex-grow">
                        "Sinceramente, foi uma das melhores decisões que já tomei! Eu tinha muito problema de estômago e, depois que instalei o purificador, nunca mais senti nada. A água é leve, gostosa e dá pra ver a diferença logo nos primeiros dias. Atendimento top e produto incrível — recomendo demais!"
                    </p>
                </div>

                {/*  Google Review 2  */}
                <div className="reveal bg-white p-8 rounded-[2rem] shadow-sm border border-dark/5 flex flex-col h-full hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
                                R
                            </div>
                            <div>
                                <div className="font-bold text-dark text-sm">Rosmeri Heineck</div>
                                <div className="text-[10px] text-dark/40">Avaliação verificada</div>
                            </div>
                        </div>
                        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    </div>
                    <div className="flex gap-1 mb-4">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </div>
                    <p className="text-sm font-light leading-relaxed text-dark/80 flex-grow">
                        "O purificador de água alcalina e ozonizada foi um dos melhores investimentos que já fizemos para nossa saúde. Qualidade e sabor inigualável. Muito satisfeitos."
                    </p>
                </div>

                {/*  Google Review 3  */}
                <div className="reveal bg-white p-8 rounded-[2rem] shadow-sm border border-dark/5 flex flex-col h-full hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg">
                                I
                            </div>
                            <div>
                                <div className="font-bold text-dark text-sm">Inez Maria Hanauer</div>
                                <div className="text-[10px] text-dark/40">Avaliação verificada</div>
                            </div>
                        </div>
                        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    </div>
                    <div className="flex gap-1 mb-4">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBC05"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </div>
                    <p className="text-sm font-light leading-relaxed text-dark/80 flex-grow">
                        "Olá, boa noite. Viemos compartilhar neste espaço, da nossa satisfação em adquirir o nosso Purificador de Água. Dizer que realmente funciona muito bem, é de fácil manuseio, e o mais importante é que a água está melhor, em termos de cor, sabor e leveza. Mas um detalhe importante também foi o atendimento prestado pelos profissionais. Fomos atendidos em nossa casa, de maneira muito cordial e gentil, com explicações técnicas e detalhadas. A instalação do aparelho foi muito bem feita pelos mesmos, não deixaram nada a dever. Só podemos agradecer aos ótimos profissionais que nos atenderam nesse investimento, em melhor qualidade de água. Água é Vida. E vida longa a Água Vita é o que desejamos! Abraços"
                    </p>
                </div>
            </div>
        </div>
    </section>

    {/*  FAQ SECTION  */}
    <section id="faq" className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-20 reveal">
                <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6 text-dark">Dúvidas Frequentes.</h2>
                <p className="text-dark/50 text-lg font-light">
                    Tudo o que você precisa saber para fazer o melhor investimento na sua saúde.
                </p>
            </div>

            <div className="space-y-4">
                <div className="faq-item reveal">
                    <button className="w-full py-6 flex items-center justify-between text-left focus:outline-none" aria-expanded="false" onClick={toggleFaq}>
                        <span className="text-lg font-medium text-dark/80">Vocês trabalham com outras marcas além da Hoken?</span>
                        <svg className="faq-icon transition-transform duration-300 text-dark/40" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <div className="faq-answer">
                        <p className="pb-6 text-dark/50 font-light leading-relaxed">
                            Sim! Somos uma loja multimarcas. Além da linha premium Hoken, trabalhamos com Planeta Água, Ulfer e diversas outras marcas líderes. Também fornecemos refis, peças e acessórios compatíveis com praticamente todas as marcas de purificadores do mercado.
                        </p>
                    </div>
                </div>
                <div className="faq-item reveal">
                    <button className="w-full py-6 flex items-center justify-between text-left focus:outline-none" aria-expanded="false" onClick={toggleFaq}>
                        <span className="text-lg font-medium text-dark/80">Como funciona a instalação?</span>
                        <svg className="faq-icon transition-transform duration-300 text-dark/40" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <div className="faq-answer">
                        <p className="pb-6 text-dark/50 font-light leading-relaxed">
                            Nossa equipe técnica especializada realiza a instalação completa em toda a região Noroeste do RS. Agendamos o melhor horário para você e garantimos que tudo esteja funcionando perfeitamente, sem sujeira ou complicações.
                        </p>
                    </div>
                </div>
                <div className="faq-item reveal">
                    <button className="w-full py-6 flex items-center justify-between text-left focus:outline-none" aria-expanded="false" onClick={toggleFaq}>
                        <span className="text-lg font-medium text-dark/80">Qual a frequência de troca do refil?</span>
                        <svg className="faq-icon transition-transform duration-300 text-dark/40" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <div className="faq-answer">
                        <p className="pb-6 text-dark/50 font-light leading-relaxed">
                            A troca do refil é recomendada a cada 3.000 litros ou 12 meses, o que ocorrer primeiro. Nós mantemos seu cadastro e avisamos você quando estiver chegando a hora da manutenção, para que sua água nunca perca a qualidade.
                        </p>
                    </div>
                </div>
                <div className="faq-item reveal">
                    <button className="w-full py-6 flex items-center justify-between text-left focus:outline-none" aria-expanded="false" onClick={toggleFaq}>
                        <span className="text-lg font-medium text-dark/80">A água gelada é realmente gelada?</span>
                        <svg className="faq-icon transition-transform duration-300 text-dark/40" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <div className="faq-answer">
                        <p className="pb-6 text-dark/50 font-light leading-relaxed">
                            Sim! Nossos modelos refrigerados (CPD23) possuem um sistema de alta performance que mantém a água entre 5°C e 10°C, ideal para os dias mais quentes, com baixo consumo de energia.
                        </p>
                    </div>
                </div>
                <div className="faq-item reveal">
                    <button className="w-full py-6 flex items-center justify-between text-left focus:outline-none" aria-expanded="false" onClick={toggleFaq}>
                        <span className="text-lg font-medium text-dark/80">Quais as formas de pagamento?</span>
                        <svg className="faq-icon transition-transform duration-300 text-dark/40" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <div className="faq-answer">
                        <p className="pb-6 text-dark/50 font-light leading-relaxed">
                            Oferecemos total flexibilidade: Cartão de crédito, PIX, boleto parcelado (sujeito a análise) e cheque. Facilitamos o investimento para que sua família tenha saúde agora.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/*  GARANTIA E SELOS  */}
    <section className="py-24 border-t border-dark/5">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-700 text-dark">
                <div className="flex items-center gap-3">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <span className="text-xs font-bold uppercase tracking-widest">Garantia de Fábrica</span>
                </div>
                <div className="flex items-center gap-3">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                    <span className="text-xs font-bold uppercase tracking-widest">Selo INMETRO</span>
                </div>
                <div className="flex items-center gap-3">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    <span className="text-xs font-bold uppercase tracking-widest">Peças Multimarcas</span>
                </div>
                <div className="flex items-center gap-3">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span className="text-xs font-bold uppercase tracking-widest">Atendimento RS</span>
                </div>
            </div>
        </div>
    </section>

    {/*  CTA FINAL  */}
    <section className="py-32 relative border-t border-dark/5 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center reveal">
            <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-8 text-dark">Eleve sua água.<br />Eleve sua vida.</h2>
            <p className="text-dark/50 text-lg font-light mb-12 max-w-xl mx-auto">
                Fale com nossos especialistas e descubra qual modelo das nossas marcas premium é perfeito para o seu estilo de vida.
            </p>
            <a href="https://wa.me/5554999997286" target="_blank" rel="noopener noreferrer" aria-label="Falar com especialista no WhatsApp" className="inline-flex items-center gap-3 bg-dark text-white px-12 py-5 rounded-full font-medium tracking-wide cta-hover">
                Falar com Especialista
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </a>
        </div>
    </section>

    {/*  WHATSAPP FLOAT  */}
    <a href="https://wa.me/5554999997286" target="_blank" rel="noopener noreferrer" aria-label="Contato via WhatsApp" className="whatsapp-float">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    </a>

    {/*  BACK TO TOP  */}
    <button id="back-to-top" aria-label="Voltar ao topo" onClick={scrollToTop} className="fixed bottom-10 left-10 w-12 h-12 rounded-full bg-white border border-dark/5 text-dark/40 flex items-center justify-center opacity-0 invisible transition-all duration-500 hover:text-primary hover:border-primary/20 z-50 shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
    </button>

    {/*  FOOTER  */}
    <footer className="bg-dark text-white pt-24 pb-12 relative overflow-hidden">
        {/* Subtle top gradient line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 mb-20">
                {/*  Left Side: Logo & Info (col-span-4)  */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-primary">
                                <path d="M12 2L12 2C12 2 4 9 4 14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14C20 9 12 2 12 2Z" />
                                <circle cx="12" cy="14" r="3" />
                                <path d="M12 2V5" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-display font-light text-xl tracking-[0.4em] text-white uppercase leading-none">Aqua<span className="text-primary">Vita</span></span>
                        </div>
                    </div>
                    <p className="text-white/60 text-sm font-light leading-relaxed max-w-sm">
                        Especialistas em purificação de água. Levando saúde, tecnologia e design premium para a sua casa ou empresa.
                    </p>
                    <div className="flex gap-4 mt-2">
                        <a href="https://instagram.com/aquavitapurificadores" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="https://wa.me/5554999997286" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        </a>
                    </div>
                </div>

                {/* Middle: Links & Contact (col-span-3) */}
                <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-10">
                    <div className="flex-1">
                        <h4 className="font-bold text-sm tracking-widest uppercase text-white mb-6">Navegação</h4>
                        <ul className="flex flex-col gap-3 text-sm text-white/60 font-light">
                            <li><a href="#diferenciais" className="hover:text-primary transition-colors">Tecnologia</a></li>
                            <li><a href="#ozonio" className="hover:text-primary transition-colors">Poder do Ozônio</a></li>
                            <li><a href="#alcalina" className="hover:text-primary transition-colors">Água Alcalina</a></li>
                            <li><a href="#sobre" className="hover:text-primary transition-colors">Sobre Nós</a></li>
                        </ul>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-sm tracking-widest uppercase text-white mb-6">Atendimento</h4>
                        <ul className="flex flex-col gap-3 text-sm text-white/60 font-light">
                            <li className="flex items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Seg a Sex: 08h às 18h
                            </li>
                            <li className="flex items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Sábado: 08h às 12h
                            </li>
                        </ul>
                    </div>
                </div>

                {/*  Right Side: Contact Form (col-span-5)  */}
                <div className="lg:col-span-5">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                        <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-2">Fale Conosco</h3>
                        <p className="text-white/60 text-sm font-light mb-6">Envie sua dúvida e responderemos rapidamente via WhatsApp.</p>
                        <form className="flex flex-col gap-4" onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const name = formData.get('name');
                            const email = formData.get('email');
                            const message = formData.get('message');
                            
                            // Construct WhatsApp message
                            const text = `Olá! Meu nome é ${name} (${email}).\n\nMensagem: ${message}`;
                            const encodedText = encodeURIComponent(text);
                            window.open(`https://wa.me/5554999997286?text=${encodedText}`, '_blank');
                            
                            e.currentTarget.reset();
                        }}>
                            <div>
                                <input 
                                    type="text" 
                                    name="name"
                                    id="name" 
                                    required
                                    placeholder="Seu Nome" 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                            </div>
                            <div>
                                <input 
                                    type="email" 
                                    name="email"
                                    id="email" 
                                    required
                                    placeholder="Seu E-mail" 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                />
                            </div>
                            <div>
                                <textarea 
                                    name="message"
                                    id="message" 
                                    required
                                    placeholder="Sua Mensagem" 
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                className="bg-primary text-white rounded-xl px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-dark transition-colors mt-2 w-full"
                            >
                                Enviar Mensagem
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-white/40 text-[10px] font-light tracking-widest uppercase text-center md:text-left">
                    &copy; 2026 AquaVita Purificadores. Todos os direitos reservados.
                </div>
                <div className="text-white/40 text-[10px] font-light tracking-widest uppercase">
                    Design Premium
                </div>
            </div>
        </div>
    </footer>

    {/*  GSAP Animations Script  */}
    

    {/*  UNIFIED SCRIPTS  */}
    

    </div>
  );
}