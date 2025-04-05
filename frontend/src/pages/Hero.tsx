import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresSectionRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Animation for background spheres
  useEffect(() => {
    const spheres = document.querySelectorAll('.animated-sphere');
    
    spheres.forEach((sphere, index) => {
      const speed = 2 + (index * 0.5);
      gsap.to(sphere, {
        y: "random(-20, 20)",
        x: "random(-20, 20)",
        duration: speed,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.2
      });
    });
  }, []);
  
  useEffect(() => {
    // Initial load animation
    const tl = gsap.timeline();
    
    tl.to('.loader', {
      opacity: 0,
      duration: 1,
      onComplete: () => setIsLoaded(true)
    });
    
    // Only run these animations after page has loaded
    if (isLoaded) {
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2
      });
      
      gsap.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.5
      });
      
      gsap.from(ctaRef.current, {
        y: 20,
        opacity: 0,
        duration: 1,
        delay: 0.8
      });
      
      // ScrollTrigger for features section
      gsap.from('.feature-card', {
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        scrollTrigger: {
          trigger: featuresSectionRef.current,
          start: 'top 80%'
        }
      });
    }
  }, [isLoaded]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Loader */}
      <div className="loader fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
      
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col items-center justify-center px-4 md:px-8" ref={heroRef}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 to-transparent"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="animated-sphere w-64 h-64 rounded-full bg-blue-600/10 absolute -top-20 -left-20 blur-xl"></div>
          <div className="animated-sphere w-96 h-96 rounded-full bg-purple-600/10 absolute top-1/3 -right-40 blur-xl"></div>
          <div className="animated-sphere w-48 h-48 rounded-full bg-pink-600/10 absolute bottom-20 left-1/4 blur-xl"></div>
          <div className="animated-sphere w-32 h-32 rounded-full bg-yellow-500/10 absolute top-1/4 left-1/3 blur-xl"></div>
          <div className="animated-sphere w-56 h-56 rounded-full bg-teal-500/10 absolute bottom-1/3 right-1/4 blur-xl"></div>
        </div>
        
        {/* Decorative Device Mockup */}
        <div className="absolute z-0 w-full max-w-2xl mx-auto opacity-60 transform -translate-y-8">
          <div className="relative w-full aspect-[16/9]">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 opacity-20 blur-md"></div>
            <div className="absolute inset-[3%] rounded-lg bg-gray-900 flex items-center justify-center">
              <div className="w-4/5 h-3/5 bg-gradient-to-r from-blue-500 to-purple-600 rounded opacity-50"></div>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-4 bg-gray-800 rounded-t-lg"></div>
          </div>
        </div>
        
        {/* Text Content */}
        <div className="container mx-auto text-center relative z-10">
          <h1 
            ref={titleRef} 
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            Elevate Your Digital Presence
          </h1>
          <p 
            ref={subtitleRef}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10"
          >
            Create captivating stories and share your knowledge with the world through our modern blogging platform.
          </p>
          <div ref={ctaRef} className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register" 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-lg font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-blue-500/25"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full text-lg font-semibold hover:bg-white/20 transition-all border border-white/30"
            >
              Login
            </Link>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
          <span className="text-sm mb-2">Scroll to explore</span>
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 14l-7 7m0 0l-7-7m7 7V3" 
            />
          </svg>
        </div>
      </div>
      
      {/* Features Section */}
      <div 
        ref={featuresSectionRef}
        className="py-20 px-4 md:px-8 bg-gradient-to-b from-black to-blue-950"
      >
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Unleash Your Creativity
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                  </svg>
                ),
                title: "Intuitive Editor",
                description: "Write and format your content effortlessly with our powerful yet simple editor."
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                  </svg>
                ),
                title: "Beautiful Themes",
                description: "Choose from a variety of professionally designed themes to showcase your content."
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                ),
                title: "Lightning Fast",
                description: "Optimized performance ensures your blog loads quickly for all visitors."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="feature-card bg-white/5 backdrop-blur-sm rounded-xl p-8 hover:bg-white/10 transition-all border border-white/10 hover:border-white/20"
              >
                <div className="mb-5">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-20 px-4 md:px-8 bg-gradient-to-b from-blue-950 to-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Blogging Journey?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Join thousands of writers and content creators who have already found their voice on our platform.
          </p>
          <Link 
            to="/register" 
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-lg font-semibold hover:opacity-90 transition-all inline-block"
          >
            Create Your Blog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
