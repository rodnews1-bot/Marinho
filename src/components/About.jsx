import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, Scale, HeartHandshake as Handshake, BookOpen } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="relative py-12 lg:py-20 bg-slate-900 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-amber-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 lg:mb-16"
        >
          <span className="text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider">Sobre o Fundador</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
            Rodrigo Moreira Marinho:{' '}
            <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent block sm:inline">
              Experiência e Liderança
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Conheça o compromisso e a expertise por trás do Marinho Advocacia.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="relative group w-[280px] sm:max-w-[350px]">
              {/* Background accent ring */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-amber-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              
              <div className="relative rounded-full p-2 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl aspect-square">
                <img 
                  alt="Rodrigo Moreira Marinho - Advogado Criminalista" 
                  className="rounded-full w-full h-full object-cover border-4 border-slate-800 shadow-lg transform group-hover:scale-[1.02] transition-transform duration-500"
                  src="https://horizons-cdn.hostinger.com/fc1a8f30-56b6-4386-b03a-0cb5e72f383b/e3c8a979e4721ff591e3806882c33458.png" 
                />
              </div>
              
              {/* Floating badges for visual balance */}
              <motion.div
                className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-lg text-xs sm:text-sm font-semibold flex items-center gap-2"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                OAB/MT 18.791
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-6"
          >
            <div className="text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Rodrigo Moreira Marinho</h3>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                  Advogado criminalista por vocação e fundador do Marinho Advocacia, Rodrigo Moreira Marinho é sinônimo de excelência e combatividade jurídica. Sua carreira é marcada por uma atuação incansável na defesa dos direitos e da liberdade de seus clientes.
                </p>
            </div>

            <ul className="space-y-4 sm:space-y-6 text-slate-300">
              <li className="flex items-start gap-3 sm:gap-4">
                <div className="bg-amber-500/10 p-2 sm:p-3 rounded-xl mt-1 shrink-0">
                  <Gavel className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                </div>
                <div>
                  <strong className="text-white text-base sm:text-lg block mb-1">Expertise em Direito Penal</strong>
                  <span className="text-sm sm:text-base leading-relaxed block">
                    Ampla experiência em prisões em flagrante, audiências de custódia, investigações criminais, ações penais complexas e defesas no Tribunal do Júri.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <div className="bg-blue-500/10 p-2 sm:p-3 rounded-xl mt-1 shrink-0">
                  <Handshake className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <div>
                  <strong className="text-white text-base sm:text-lg block mb-1">Defesa do Cidadão e Consumidor</strong>
                  <span className="text-sm sm:text-base leading-relaxed block">
                    Especialista na defesa contra instituições financeiras, cobranças abusivas e renegociação de dívidas. Foco em revisão de empréstimos consignados, protegendo seu patrimônio.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <div className="bg-green-500/10 p-2 sm:p-3 rounded-xl mt-1 shrink-0">
                  <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                </div>
                <div>
                  <strong className="text-white text-base sm:text-lg block mb-1">Liderança e Compromisso Institucional</strong>
                  <span className="text-sm sm:text-base leading-relaxed block">
                    Presidente da Associação Nacional da Advocacia Criminal de Mato Grosso (ANACRIM-MT), Conselheiro Estadual da OAB-MT e integrante do Tribunal de Defesa das Prerrogativas.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3 sm:gap-4">
                <div className="bg-purple-500/10 p-2 sm:p-3 rounded-xl mt-1 shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <div>
                  <strong className="text-white text-base sm:text-lg block mb-1">Filosofia de Trabalho</strong>
                  <span className="text-sm sm:text-base leading-relaxed block">
                    Advocacia técnica, humana e responsável. Cada caso é tratado com a máxima dedicação, utilizando as ferramentas jurídicas mais eficazes e atendimento ético.
                  </span>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;