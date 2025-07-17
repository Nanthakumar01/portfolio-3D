import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { ChevronDown, Github, ExternalLink, Mail, Phone, MapPin, Code, Database, Smartphone, Award, Briefcase,ChevronLeft, ChevronRight } from 'lucide-react';

const ThreeJSPortfolio = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animatedText, setAnimatedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  const sections = ['Home', 'About', 'Skills', 'Experience', 'Certificates', 'Projects', 'Contact'];

  // Typewriter effect for name
  useEffect(() => {
    const name = "NANTHAKUMAR";
    let index = 0;
    const typeWriter = () => {
      if (index < name.length) {
        setAnimatedText(name.substring(0, index + 1));
        index++;
        setTimeout(typeWriter, 200);
      } else {
        // Blink cursor effect
        setInterval(() => {
          setShowCursor(prev => !prev);
        }, 500);
      }
    };
    typeWriter();
  }, []);

  const projectScrollRef = useRef(null);
  const certificateScrollRef = useRef(null);

  const scrollLeft = (ref) => {
    ref.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = (ref) => {
    ref.current.scrollBy({ left: 300, behavior: 'smooth' });
  }





  useEffect(() => {
  const sectionElements = sections.map((_, i) => document.getElementById(`section-${i}`));
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionElements.indexOf(entry.target);
          if (index !== -1) {
            setCurrentSection(index);
          }
        }
      });
    },
    {
      threshold: 0.6, 
    }
  );

  sectionElements.forEach((el) => el && observer.observe(el));

  return () => {
    sectionElements.forEach((el) => el && observer.unobserve(el));
  };
}, []);


  // Intersection Observer for heading animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
        }
      });
    }, observerOptions);

    // Observe all headings
    const headings = document.querySelectorAll('.animated-heading');
    headings.forEach(heading => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a0a);
    rendererRef.current = renderer;
    
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Particle system
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      colors[i] = Math.random();
      colors[i + 1] = Math.random() * 0.5 + 0.5;
      colors[i + 2] = 1;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    particlesRef.current = particleSystem;
    
    

    // Floating geometric shapes
    const shapes = [];
    for (let i = 0; i < 5; i++) {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
        transparent: true,
        opacity: 0.3
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      scene.add(cube);
      shapes.push(cube);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.002;
        particlesRef.current.rotation.x += 0.001;
      }

      // Animate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.01;
        shape.rotation.y += 0.01;
        shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const scrollToSection = (index) => {
    setCurrentSection(index);
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const projects = [
    {
      title: "CRUD Dashboard",
      description: "A comprehensive web interface for managing database records with create, read, update, and delete functionality.",
      tech: ["React", "JavaScript", "CSS"],
      icon: <Database className="w-8 h-8" />,
      image: "/img/dashboard.jpg",
      liveLink: "https://admin-dashboard-gold-one-19.vercel.app/"
    },
    {
      title: "To-Do List App",
      description: "React-based task management app with real-time updates and local storage support.",
      tech: ["React", "Tailwind CSS", "Local Storage"],
      icon: <Code className="w-8 h-8" />,
      image: "/img/todo1.jpg",
      liveLink: "https://nanthakumar01.github.io/todo-list/"
    },
    {
      title: "E-commerce Site",
      description: "Full-featured online store with product catalog, shopping cart, and Firebase authentication.",
      tech: ["React", "Firebase", "Bootstrap"],
      icon: <Smartphone className="w-8 h-8" />,
      image: "/img/ecom.jpg",
      liveLink: "https://e-com-nanthakumars-projects-05c19193.vercel.app/"
    },
  ];

  const skills = [
    { name: "HTML5", icon: "🌐", color: "from-orange-400 to-red-500" },
    { name: "CSS3", icon: "🎨", color: "from-blue-400 to-cyan-500" },
    { name: "JavaScript", icon: "⚡", color: "from-yellow-400 to-orange-500" },
    { name: "React", icon: "⚛️", color: "from-blue-400 to-purple-500" },
    { name: "Bootstrap", icon: "🎯", color: "from-purple-400 to-pink-500" },
    { name: "Firebase", icon: "🔥", color: "from-orange-400 to-yellow-500" },
    { name: "Git", icon: "📚", color: "from-gray-400 to-gray-600" },
    { name: "Responsive Design", icon: "📱", color: "from-green-400 to-teal-500" }
  ];

  const experiences = [
    {
      title: "Frontend Developer Intern",
      company: "Cognifyz.",
      duration: "Jun 2024 - Aug 2024",
      description: "Built multiple client websites using HTML, CSS, and JavaScript. Gained experience in responsive design and cross-browser compatibility.",
      skills: ["HTML5", "JavaScript", "CSS3","GitHub"],
      link: "https://drive.google.com/file/d/1VGTNDbRDXLfktRBc_KdyIjnqZfLWavyW/view?usp=drivesdk"
    },
    {
      title: "Web Development Intern",
      company: "Cognifyz",
      duration: "Jan 2025 - Mar 2025",
      description: "Developed responsive web applications using React and modern CSS frameworks. Collaborated with senior developers to implement user-friendly interfaces.",
      skills: ["JavaScript", "Bootstrap","React","Node"],
      link: "https://drive.google.com/file/d/1DKcyG6tm8WCPl8ji4HoNXgDsTKqMQOSq/view?usp=drivesdk",
    },
  ];

  const certificates = [
    {
      title: "React Developer Certification",
      issuer: "HackerRank",
      date: "2025",
      description: "Basic course covering React fundamentals, hooks, state management",
      link: "https://www.hackerrank.com/certificates/57f029f593a3",
      image: "/img/certificate6.jpg",
      verified: true
    },
    {
      title: "React Hooks Techniques",
      issuer: "Mind Luster",
      date: "2024",
      description: "Learned advanced React concepts, focusing on hooks such as useState, useEffect, and custom hooks.",
      link: "https://drive.google.com/file/d/1VECkwaNbHHOUMrQOKVucJBsrnhtCM2NX/view?usp=drive_link",
      image: "/img/certificate4.jpg",
      verified: true
    },
    {
      title: "Full Stack Developer Bootcamp - Master Frontend to Backend",
      issuer: "GeeksforGeeks",
      date: "204",
      description: "300+ hours of coursework covering ES6, algorithms and functional programming.",
      link: "https://drive.google.com/file/d/1VP7f27YXM2ui725sCp7FWP6x_4kWq_N8/view?usp=drivesdk",
      image: "/img/certificate3.jpg",
      verified: true
    },
    {
      title: "CSS and JavaScript for Beginners",
      issuer: "udemy",
      date: "2024",
      description: "Comprehensive training in HTML5, CSS3, Flexbox, Grid, and responsive design principles.",
      link: "https://drive.google.com/file/d/1VsaIx5qfAwt_ZCWgMi94Rccg1kpQQXoz/view?usp=drivesdk",
      image: "/img/certificate2.jpg",
      verified: true
    },
    {
      title: "Web Development Job Simulation",
      issuer: "Forage",
      date: "2025",
      description: "Specialized course covering React ecosystem and deployment strategies.",
      link: "https://drive.google.com/file/d/1FoDEKQt2JlPsPRHXMUC1R4K1PEKFz6fN/view?usp=drivesdk",
     image: "/img/certificate1.jpg",
      verified: true
    },
    {
      title: "Communication Skills",
      issuer: "TCS ION",
      date: "2024",
      description: "Developed strong verbal and written communication with a focus on professional and team collaboration",
      link: "https://drive.google.com/file/d/1VU6-eYWLytQ2I7pMaesBp67RILtDndjI/view?usp=drivesdk",
      image: "/img/certificate5.jpg",
      verified: true
    }
  ];

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
          @keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>

      {/* Three.js Background */}
      <div ref={mountRef} className="fixed inset-0 -z-10" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              NK
            </div>
            
            <div className="hidden md:flex space-x-8">
              {sections.map((section, index) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(index)}
                  className={`transition-colors duration-200 ${
                    currentSection === index ? 'text-blue-400' : 'text-white hover:text-blue-400'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`}></span>
                <span className={`w-full h-0.5 bg-white transition-all duration-300 mt-1 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 bg-white transition-all duration-300 mt-1 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {sections.map((section, index) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(index)}
                  className="block w-full text-left px-3 py-2 text-white hover:text-blue-400 transition-colors"
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="section-0" className="min-h-screen flex items-center justify-center relative ">
        <div className="text-center max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <div className="w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-400 to-purple-500 p-1 animate-fade-in-scale">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center backdrop-blur-sm">
                <img 
                  src="/img/img.jpg"
                  alt="Nanthakumar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {animatedText}
            {showCursor && <span className="typewriter-cursor"></span>}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 animate-slide-in-left">
            Front-End Developer 
          </p>
          <p className="text-lg mb-12 text-gray-400 max-w-2xl mx-auto animate-slide-in-right">
            I specialize in creating beautiful and intuitive web designs using modern technologies like React, JavaScript, and CSS. 
            Passionate about crafting engaging user experiences.
          </p>
          <a
                href="https://drive.google.com/file/d/1Fr7qvOK8u8ZAD8GZOcywVNeGB6endhoK/view?usp=drivesdk" 
                target='_blank'
                download
                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-full text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 animate-float">
                  Download CV
        </a>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
          <ChevronDown className="w-8 h-8 text-white/50" />
        </div>
      </section>

      {/* About Section */}
      <section id="section-1" className="min-h-screen flex items-center py-20">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="animated-heading text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              About Me
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              As an aspiring Front-End Developer, I am passionate about creating visually appealing and user-friendly websites. 
              I have a solid foundation in HTML, CSS, JavaScript and React, and I am eager to apply my skills in real-world projects.
            </p>
            <p className="text-lg text-gray-300 mb-6">
              My recent coursework and personal projects have equipped me with hands-on experience in responsive design and 
              web performance optimization. I am a quick learner and a team player, always ready to take on new challenges.
            </p>
            <p className="text-lg text-gray-300">
              My goal is to leverage my skills in front-end development to create engaging user experiences that make a positive impact.
            </p>
          </div>
          <div className="relative">
            <div className="w-80 h-80 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
              <div className="w-60 h-60 bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full flex items-center justify-center">
                <Code className="w-24 h-24 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="section-2" className="min-h-screen flex items-center py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="animated-heading text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Skills & Technologies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <div 
                key={skill.name} 
                className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:rotate-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:animate-bounce">
                    {skill.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{skill.name}</h3>
                  <div className={`w-full h-1 bg-gradient-to-r ${skill.color} rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="section-3" className="min-h-screen flex items-center py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="animated-heading text-4xl md:text-5xl font-bold leading-tight mb-16 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Experience
          </h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-102">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                    <p className="text-lg text-blue-400 mb-2">{exp.company}</p>
                  </div>
                  <div className="text-gray-400 font-medium">
                    {exp.duration}
                  </div>
                  
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 rounded-full text-sm border border-blue-400/30"
                    >
                      {skill}
                    </span>
                  ))}
                  <button 
                  onClick={() => window.open(exp.link, '_blank')}
                  className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Certificate</span>
                </button>
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </section>


         {/* Certificates Section */}
      <section id="section-4" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Certificates & Achievements
          </h2>

          <div className="relative">
            <button onClick={() => scrollLeft(certificateScrollRef)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 p-2 rounded-full hover:bg-white/20">
              <ChevronLeft />
            </button>

            <div ref={certificateScrollRef} className="overflow-x-auto flex gap-6 scroll-smooth pb-4">
              {certificates.map((cert, index) => (
                <div key={index} className="min-w-[300px] bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105">
                  <img src={cert.image} alt={cert.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-1">{cert.title}</h3>
                    <p className="text-blue-400">{cert.issuer}</p>
                    <p className="text-gray-400 text-sm">{cert.date}</p>
                    <p className="text-gray-300 mt-2 text-sm">{cert.description}</p>
                    {cert.verified && (
                      <div className="mt-2 text-green-400 text-xs bg-green-500/20 border border-green-400/30 px-2 py-1 rounded-full inline-block">Verified</div>
                    )}
                    <button onClick={() => window.open(cert.link, '_blank')} className="mt-3 flex items-center space-x-2 text-purple-400 hover:text-purple-300 text-sm">
                      <ExternalLink className="w-4 h-4" />
                      <span>View Certificate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => scrollRight(certificateScrollRef)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 p-2 rounded-full hover:bg-white/20">
              <ChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="section-5" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold leading-snug mb-12 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
  Projects
</h2>

          <div className="relative">
            <button onClick={() => scrollLeft(projectScrollRef)} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 p-2 rounded-full hover:bg-white/20">
              <ChevronLeft />
            </button>

            <div ref={projectScrollRef} className="overflow-x-auto flex gap-6 scroll-smooth pb-4">
              {projects.map((project, index) => (
                <div key={index} className="min-w-[300px] bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                  <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <div className="text-blue-400 text-xl mb-1">{project.icon}</div>
                    <h3 className="text-xl font-bold text-white">{project.title}</h3>
                    <p className="text-gray-300 text-sm my-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.tech.map((tech, techIndex) => (
                        <span key={techIndex} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 text-sm">
                      <ExternalLink className="w-4 h-4" />
                      <span>Live</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => scrollRight(projectScrollRef)} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 p-2 rounded-full hover:bg-white/20">
              <ChevronRight />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="section-6" className="min-h-screen flex items-center py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="animated-heading text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white">Let's Connect</h3>
              <p className="text-lg text-gray-300 mb-8">
                I'm always open to discussing new opportunities and interesting projects. 
                Feel free to reach out if you'd like to collaborate!
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <a href='mailto:knantha631@gmail.com'>
                    <p className="text-white font-semibold">Email</p>
                    <p className="text-gray-400">knantha631@gmail.com</p>
                    </a>
                   
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <a href='tel:+919894688541'>
                    <p className="text-white font-semibold">Phone</p>
                    <p className="text-gray-400">+91 9894688541</p>
                    </a>
                    
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Location</p>
                    <p className="text-gray-400">Coimbatore,pollachi, Tamil Nadu, India</p>
                  </div>
                </div>
              </div>
            </div>
            
            <form 
  action="mailto:knantha631@gmail.com" 
  method="POST" 
  encType="text/plain"
  className="space-y-6"
>
  <div>
    <label className="block text-white text-sm font-medium mb-2">Name</label>
    <input 
      type="text" 
      name="name"
      required
      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
      placeholder="Your name"
    />
  </div>

  <div>
    <label className="block text-white text-sm font-medium mb-2">Email</label>
    <input 
      type="email" 
      name="email"
      required
      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
      placeholder="your@email.com"
    />
  </div>

  <div>
    <label className="block text-white text-sm font-medium mb-2">Message</label>
    <textarea 
      name="message"
      required
      rows={4}
      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
      placeholder="Your message..."
    ></textarea>
  </div>

  <button 
    type="submit"
    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-3 rounded-lg text-white font-semibold hover:scale-105 transition-all"
  >
    Send Message
  </button>
</form>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Nanthakumar. Built with React.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ThreeJSPortfolio;