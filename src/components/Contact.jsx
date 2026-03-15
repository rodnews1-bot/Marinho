import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Calendar, MapPin, Phone, Mail, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWhatsAppLink, DEFAULT_CONTACT_MESSAGE } from '@/lib/whatsappConfig';

const Contact = () => {
  const handleWhatsApp = () => {
    window.open(getWhatsAppLink(DEFAULT_CONTACT_MESSAGE), '_blank');
  };

  const handleSchedule = () => {
    window.open('https://calendar.google.com/calendar/appointments/schedules/AcZssZ05LQBaGSMp19S1g1pQyxfnE5wQBnvoKBO2XmzKCqbKNYm0hIJ0oz1ySTgDHDzlwjBSq1NEKUe7', '_blank');
  };

  const handleEmail = () => {
    window.location.href = "mailto:contato@marinhoadvogado.com.br";
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Telefone / WhatsApp",
      content: "(65) 99282-3630",
      action: handleWhatsApp
    },
    {
      icon: Mail,
      title: "E-mail Profissional",
      content: "contato@marinhoadvogado.com.br",
      action: handleEmail
    },
    {
      icon: MapPin,
      title: "Sede",
      content: "Cuiabá/MT - Atuação Nacional",
      action: null
    },
    {
      icon: Clock,
      title: "Horário de Atendimento",
      content: "Todos os dias da semana: 24 Horas",
      action: handleSchedule
    }
  ];

  return (
    <section id="contact" className="relative py-12 lg:py-20 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 lg:mb-16"
        >
          <span className="text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider">Fale Conosco</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 mb-4">
            Seu problema tem <span className="text-red-500">prazo</span>. <br className="hidden sm:block"/> Não espere o pior acontecer.
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Na advocacia, o tempo é o maior inimigo. Agende uma consulta agora e receba a orientação estratégica que seu caso exige.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-700/50">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Canais de Atendimento</h3>
              
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={info.action}
                    className={`flex items-start gap-4 p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-all border border-transparent hover:border-blue-500/30 ${info.action ? 'cursor-pointer group' : ''}`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                      <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-slate-400 text-xs sm:text-sm font-medium">{info.title}</div>
                      <div className="text-white font-bold text-sm sm:text-lg break-all sm:break-normal">{info.content}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-amber-900/10 border border-amber-500/20 rounded-2xl p-4 sm:p-6 flex gap-4 items-start">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-amber-500 font-bold mb-1 text-sm sm:text-base">Importante</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Não fornecemos consultoria gratuita via WhatsApp. Nosso atendimento é personalizado e técnico, demandando análise aprofundada do seu caso.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right - CTA */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 rounded-3xl p-6 sm:p-10 border border-blue-500/30 shadow-2xl relative overflow-hidden">
              {/* Decorative shine */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />

              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 relative z-10">Agilidade e Eficiência</h3>
              <p className="text-slate-300 text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed relative z-10">
                Você pode falar diretamente com nossa equipe pelo WhatsApp ou agendar uma videoconferência para atendimento imediato, sem sair de casa.
              </p>

              <div className="space-y-4 relative z-10 w-full">
                <Button
                  onClick={handleWhatsApp}
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-full shadow-lg shadow-green-900/30 hover:shadow-green-500/40 transform hover:-translate-y-1 transition-all duration-300 py-6 text-base sm:text-lg group"
                >
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:animate-bounce" />
                  <span className="truncate">Falar com Especialista via WhatsApp</span>
                </Button>

                <Button
                  onClick={handleSchedule}
                  size="lg"
                  variant="outline"
                  className="w-full bg-transparent border-2 border-blue-500 text-blue-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 font-bold rounded-full shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1 transition-all duration-300 py-6 text-base sm:text-lg"
                >
                  <Calendar className="w-5 h-5 sm:w-5 sm:h-5 mr-3" />
                  Visualizar Agenda
                </Button>
              </div>

              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm relative z-10 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-slate-400">Atendendo agora</span>
                </div>
                <div className="text-slate-500">
                  Resposta média: 15 min
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;