import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Info } from 'lucide-react';

const Testimonials = () => {
  // Testimonials compliant with OAB regulations (Provimento 205/2021 and Ethics Code)
  // Focusing on service quality, professionalism, and expertise, avoiding guaranteed outcomes.
  const testimonials = [
    {
      name: "Maria S.",
      role: "Cliente - Direito do Consumidor",
      content: "Fiquei impressionada com a clareza e transparência do Dr. Rodrigo. Desde a primeira consulta, entendi os riscos e as possibilidades do meu caso. O atendimento foi impecável e me senti segura durante todo o processo.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1629896295208-66aed41e62a2?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "João P.",
      role: "Cliente - Direito Penal",
      content: "Profissionalismo de alto nível. A equipe demonstrou um conhecimento técnico profundo e elaborou uma estratégia de defesa extremamente detalhada. A dedicação e o respeito com que fui tratado fizeram toda a diferença.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1688484185622-3cd9878ebe73?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Global Solutions Ltda.",
      role: "Cliente - Direito Tributário",
      content: "A consultoria tributária foi um divisor de águas para nossa empresa. A análise minuciosa permitiu identificar oportunidades legais de economia que desconhecíamos. Serviço técnico e extremamente competente.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1485531865381-286666aa80a9?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Carlos O.",
      role: "Cliente - Renegociação",
      content: "Agradeço pela paciência e pela condução ética da minha renegociação. O escritório buscou incansavelmente uma solução justa, sempre me mantendo informado de cada passo. Recomendo pela seriedade.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1574594862606-48cdbcfc24cb?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Patricia A.",
      role: "Cliente - Previdenciário",
      content: "O planejamento previdenciário realizado pelo Dr. Rodrigo me deu uma nova perspectiva. Foi tudo explicado com muita didática e competência. Sinto que meu futuro está sendo cuidado por mãos experientes.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1680049118554-b2e40e2eef36?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Roberto F.",
      role: "Cliente - Consultoria",
      content: "Excelente assessoria. A postura preventiva e orientadora do escritório me evitou diversas dores de cabeça contratuais. Advocacia séria e comprometida com a ética.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1690562568374-ad1612f1318e?auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <section id="testimonials" className="relative py-12 lg:py-20 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 lg:mb-16"
        >
          <span className="text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider">Depoimentos Reais</span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 mb-4">
            Confiança se constrói com <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">Excelência</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Veja o que nossos clientes dizem sobre nosso atendimento, dedicação e competência técnica.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300"
            >
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
              </div>

              <div className="relative z-10">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed italic text-sm">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                    <img 
                      src={testimonial.image} 
                      alt={`Foto de ${testimonial.name}`}
                      className="w-full h-full rounded-full object-cover border-2 border-slate-700 shadow-lg group-hover:border-amber-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-slate-500 text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <div className="flex items-center gap-2 text-xs text-slate-500 max-w-2xl text-center bg-slate-900/50 p-4 rounded-lg border border-slate-800">
            <Info className="w-4 h-4 flex-shrink-0" />
            <p>
              Em conformidade com o Código de Ética e Disciplina da OAB, os depoimentos acima refletem a opinião pessoal dos clientes sobre a qualidade do atendimento e a competência técnica, não constituindo garantia de resultado em processos futuros, pois cada caso possui suas particularidades.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;