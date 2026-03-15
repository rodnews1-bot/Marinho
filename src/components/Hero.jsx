import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, CheckCircle2, MessageCircle, Calendar, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getWhatsAppLink, DEFAULT_CONTACT_MESSAGE } from '@/lib/whatsappConfig';

const Hero = () => {
  const navigate = useNavigate();

  const handleWhatsApp = () => {
    window.open(getWhatsAppLink(DEFAULT_CONTACT_MESSAGE), '_blank');
  };

  const handleSchedule = () => {
    window.open('https://calendar.google.com/calendar/appointments/schedules/AcZssZ05LQBaGSMp19S1g1pQyxfnE5wQBnvoKBO2XmzKCqbKNYm0hIJ0oz1ySTgDHDzlwjBSq1NEKUe7', '_blank');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 lg:py-0">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 z-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center flex-col-reverse lg:flex-row">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-6 sm:space-y-8 text-center lg:text-left pt-4 lg:pt-0"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-900/30 border border-blue-500/30 rounded-full mx-auto lg:mx-0"
            >
              <ShieldAlert className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 flex-shrink-0" />
              <span className="text-blue-200 text-xs sm:text-sm font-medium text-left">Não deixe para depois o que ameaça seu futuro</span>
            </motion.div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Proteja sua Liberdade e seu{' '}
              <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
                Patrimônio
              </span>
              {' '}com Estratégia de Elite
            </h1>

            <div className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 space-y-2">
              <p>
                Atuação especializada em <strong>Direito Penal, Tributário, Previdenciário, Consumidor</strong> e <strong>Renegociação de Dívidas</strong>.
              </p>
              <p className="text-sm sm:text-base text-slate-400">
                Também atendemos demandas de <strong>Multas/Apreensão, Direitos do Autista, Concursos Públicos</strong> e <strong>Consultoria Jurídica</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 justify-center lg:justify-start w-full">
              <Button
                onClick={handleWhatsApp}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-full shadow-xl shadow-green-900/30 hover:shadow-green-500/40 transform hover:-translate-y-1 transition-all duration-300 py-6 px-6 sm:px-8 text-base sm:text-lg flex items-center justify-center gap-3 w-full sm:w-auto h-auto"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Falar com Especialista</span>
              </Button>
              
              <motion.custom
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut", type: "spring", stiffness: 150, damping: 10 }}
                className="w-full sm:w-auto"
              >
                <Button
                  onClick={() => navigate('/client-login')}
                  className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold rounded-full shadow-2xl shadow-purple-900/40 hover:shadow-cyan-500/50 transform hover:scale-110 transition-all duration-300 py-6 px-6 sm:px-8 text-base sm:text-lg flex items-center justify-center gap-3 w-full h-auto"
                >
                  <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Área do Cliente</span>
                </Button>
              </motion.custom>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 pt-4 text-sm text-slate-400 max-w-md mx-auto lg:max-w-none"
            >
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Atendimento Imediato e Sigiloso</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Estratégias Personalizadas</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Atuação em Todo o Brasil</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Tecnologia e Agilidade</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Logo/Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center relative mt-4 lg:mt-0"
          >
            <div className="relative group cursor-pointer w-[280px] sm:w-[320px] lg:w-[400px]" onClick={handleWhatsApp}>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-amber-600/30 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <img
                src="https://horizons-cdn.hostinger.com/fc1a8f30-56b6-4386-b03a-0cb5e72f383b/92e0a9b8a5489e15c13385c84dabb369.png"
                alt="Marinho Advocacia e Assessoria - Logo"
                className="relative w-full h-auto rounded-full shadow-2xl transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Floating CTA Badge */}
              <motion.div 
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-xl font-bold flex items-center gap-2 whitespace-nowrap z-20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm sm:text-base">Online Agora</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="hidden lg:flex absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center p-2 opacity-50 hover:opacity-100 transition-opacity">
          <motion.div
            className="w-1.5 h-1.5 bg-blue-400 rounded-full"
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;