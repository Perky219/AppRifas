import { motion } from 'motion/react';
import fondo from '../assets/fondo.jpeg';
import logo from '../assets/logo.png';

function WelcomePage({ onEnter }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }} 
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
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center px-8 py-12 text-center max-w-4xl mx-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {/* Logo ASECCSS */}
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }} 
          src={logo} 
          alt="ASECCSS Logo" 
          className="h-24 md:h-32 w-auto mb-8 drop-shadow-2xl"
        />
        
        {/* Tarjeta glassmorphism */}
        <motion.div 
          className="bg-white/10 backdrop-blur-md rounded-3xl px-10 py-12 border border-white/20 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg leading-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Sistema de Sorteo
          </motion.h1>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-cyan-300 mb-10 drop-shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            Feria ASECCSS Huetar Norte
          </motion.h2>
          
          <motion.button
            onClick={onEnter}
            className="px-12 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-2xl font-bold rounded-2xl shadow-2xl border border-white/30"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ingresar a la Aplicación
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default WelcomePage;
