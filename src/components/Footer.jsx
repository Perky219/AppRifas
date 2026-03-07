import logo from '../assets/logo.png';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-slate-900/80 backdrop-blur-lg border-t border-cyan-400/40 py-6 px-6 shadow-xl">
      <div className="max-w-7xl mx-auto">
        {/* Contenido principal del footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-3">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={logo} 
              alt="Logo ASECCSS" 
              className="h-12 w-auto drop-shadow-lg"
            />
          </div>
          
          {/* Texto de desarrollo */}
          <div className="text-center md:text-right">
            <p className="text-gray-100 text-sm md:text-base">
              Developed and designed by <span className="text-cyan-300 font-semibold">Luis Cubillo</span>
            </p>
          </div>
        </div>
        
        {/* Línea divisoria */}
        <div className="border-t border-cyan-400/20 mb-3"></div>
        
        {/* Derechos reservados */}
        <div className="text-center">
          <p className="text-gray-400 text-xs md:text-sm">
            © {currentYear} ASECCSS Huetar Norte. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
