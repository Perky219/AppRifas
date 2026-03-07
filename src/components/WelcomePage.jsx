import fondo from '../assets/fondo.jpeg';
import logo from '../assets/logo.png';

function WelcomePage({ onEnter }) {
  return (
    <div 
      className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay con gradiente radial para mejorar legibilidad */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)'
        }}
      ></div>
      
      {/* Contenido con efecto glassmorphism */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 py-12 text-center max-w-4xl mx-4">
        {/* Logo ASECCSS */}
        <img 
          src={logo} 
          alt="ASECCSS Logo" 
          className="h-24 md:h-32 w-auto mb-8 drop-shadow-2xl"
        />
        
        {/* Tarjeta glassmorphism */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl px-10 py-12 border border-white/20 shadow-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg leading-tight">
            Sistema de Sorteo
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-10 drop-shadow-lg">
            Feria ASECCSS Huetar Norte
          </h2>
          
          <button
            onClick={onEnter}
            className="px-12 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-2xl font-bold rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50 border border-white/30"
          >
            Ingresar a la Aplicación
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
