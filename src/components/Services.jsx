import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Gavel, MessageCircle, AlertTriangle, Car, ChevronDown, Shield, FileText, Wine, Users, Unlock, Activity, FileSearch, FileWarning, ScrollText, FileCheck, Banknote, CreditCard, Smartphone, HeartCrack, Pill, ShieldOff, Siren, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWhatsAppLink } from '@/lib/whatsappConfig';

const Services = () => {
  const [expandedItem, setExpandedItem] = useState(null);

  const handleWhatsApp = (message) => {
    window.open(getWhatsAppLink(message), '_blank');
  };

  const toggleExpand = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const services = [
    {
      id: "homicidio",
      icon: Gavel,
      title: "Homicídio e Feminicídio",
      description: "Defesa técnica de elite em crimes contra a vida. Atuação estratégica desde a investigação até o julgamento no Tribunal do Júri.",
      items: [
        { id: "hom-1", icon: Gavel, title: "Homicídio Doloso e Culposo", description: "Defesa em todas as fases: investigação, pronúncia e julgamento em Plenário." },
        { id: "hom-2", icon: HeartCrack, title: "Feminicídio", description: "Estratégia de defesa técnica e criteriosa em acusações de feminicídio." },
        { id: "hom-3", icon: Users, title: "Tribunal do Júri", description: "Sustentação oral e tese de defesa construída para o julgamento popular." },
        { id: "hom-4", icon: ShieldOff, title: "Latrocínio", description: "Defesa em casos de roubo seguido de morte, com análise técnica de autoria e materialidade." }
      ],
      buttons: [
        {
          text: "Atendimento Criminal Urgente",
          icon: <AlertTriangle className="w-4 h-4 mr-2" />,
          emoji: "🚨",
          variant: "destructive",
          message: "Olá! Preciso de defesa URGENTE em um caso de Homicídio/Feminicídio."
        }
      ]
    },
    {
      id: "estelionato",
      icon: CreditCard,
      title: "Estelionato e Fraudes",
      description: "Defesa especializada em crimes contra o patrimônio praticados por meio de fraude, engano ou abuso de confiança.",
      items: [
        { id: "est-1", icon: FileWarning, title: "Estelionato (Art. 171 CP)", description: "Defesa em golpes envolvendo cheques, contratos, vendas e negócios fraudulentos." },
        { id: "est-2", icon: Banknote, title: "Fraude em Financiamentos", description: "Atuação em acusações de fraude bancária e financiamentos irregulares." },
        { id: "est-3", icon: FileText, title: "Apropriação Indébita", description: "Defesa em casos de apropriação de bens ou valores confiados." },
        { id: "est-4", icon: ScrollText, title: "Cheque sem Fundos", description: "Defesa técnica em ações penais decorrentes de cheques sem provisão de fundos." }
      ],
      buttons: [
        {
          text: "Falar com Criminalista",
          icon: <MessageCircle className="w-4 h-4 mr-2" />,
          variant: "outline",
          message: "Olá! Estou sendo acusado(a) de Estelionato/Fraude e preciso de um advogado criminalista."
        }
      ]
    },
    {
      id: "cibercrimes",
      icon: Smartphone,
      title: "Golpes e Crimes Virtuais",
      description: "Atuação especializada na nova fronteira do crime: fraudes digitais, invasões e golpes aplicados pela internet.",
      items: [
        { id: "ciber-1", icon: AlertTriangle, title: "Golpe do Pix / Falso Sequestro", description: "Defesa em acusações envolvendo golpes financeiros aplicados via Pix, WhatsApp e redes sociais." },
        { id: "ciber-2", icon: Lock, title: "Invasão de Dispositivo Informático", description: "Defesa técnica em crimes de invasão de sistemas e dispositivos (Art. 154-A CP)." },
        { id: "ciber-3", icon: CreditCard, title: "Fraude em E-commerce", description: "Atuação em acusações relacionadas a vendas fraudulentas e clonagem de cartões." },
        { id: "ciber-4", icon: MessageCircle, title: "Crimes contra a Honra na Internet", description: "Defesa em calúnia, difamação e injúria praticadas em redes sociais." }
      ],
      buttons: [
        {
          text: "Falar com Criminalista",
          icon: <MessageCircle className="w-4 h-4 mr-2" />,
          variant: "outline",
          message: "Olá! Preciso de um advogado especialista em Crimes Virtuais/Golpes na Internet."
        }
      ]
    },
    {
      id: "violencia-domestica",
      icon: HeartCrack,
      title: "Violência Doméstica",
      description: "Defesa técnica e sigilosa em processos envolvendo a Lei Maria da Penha, com responsabilidade em casos sensíveis.",
      items: [
        { id: "vd-1", icon: Shield, title: "Medidas Protetivas", description: "Defesa e revisão de medidas protetivas de urgência." },
        { id: "vd-2", icon: Activity, title: "Lesão Corporal no Âmbito Familiar", description: "Atuação técnica em acusações de violência física ou psicológica." },
        { id: "vd-3", icon: AlertTriangle, title: "Ameaça", description: "Defesa em processos por ameaça no contexto familiar/doméstico." },
        { id: "vd-4", icon: FileWarning, title: "Descumprimento de Medida Protetiva", description: "Defesa em casos de descumprimento de medidas protetivas." }
      ],
      buttons: [
        {
          text: "Falar com Criminalista",
          icon: <MessageCircle className="w-4 h-4 mr-2" />,
          variant: "outline",
          message: "Olá! Preciso de orientação sobre um caso envolvendo a Lei Maria da Penha."
        }
      ]
    },
    {
      id: "trafico",
      icon: Pill,
      title: "Tráfico de Entorpecentes",
      description: "Defesa técnica em crimes previstos na Lei de Drogas, com análise minuciosa da prova e busca pela correta classificação jurídica do caso.",
      items: [
        { id: "traf-1", icon: Scale, title: "Tráfico de Drogas (Art. 33)", description: "Defesa técnica com análise das circunstâncias da prisão e da prova." },
        { id: "traf-2", icon: Users, title: "Associação para o Tráfico", description: "Atuação em acusações de associação criminosa para o tráfico." },
        { id: "traf-3", icon: FileSearch, title: "Porte para Uso Pessoal", description: "Busca pela correta desclassificação de tráfico para uso pessoal." },
        { id: "traf-4", icon: Siren, title: "Prisão em Flagrante por Tráfico", description: "Atuação imediata em audiências de custódia relacionadas a entorpecentes." }
      ],
      buttons: [
        {
          text: "Atendimento Criminal Urgente",
          icon: <AlertTriangle className="w-4 h-4 mr-2" />,
          emoji: "🚨",
          variant: "destructive",
          message: "Olá! Tenho uma URGÊNCIA envolvendo prisão por Tráfico de Drogas."
        }
      ]
    },
    {
      id: "roubo-furto",
      icon: ShieldOff,
      title: "Roubo e Furto",
      description: "Defesa em crimes contra o patrimônio praticados com ou sem violência, com estratégia voltada à individualização da conduta e da pena.",
      items: [
        { id: "rf-1", icon: AlertTriangle, title: "Roubo (Art. 157)", description: "Defesa técnica em acusações de subtração de bens mediante violência ou grave ameaça." },
        { id: "rf-2", icon: FileSearch, title: "Furto (Art. 155)", description: "Atuação em crimes de subtração patrimonial sem violência." },
        { id: "rf-3", icon: FileText, title: "Receptação", description: "Defesa em acusações de aquisição ou ocultação de produto de crime." },
        { id: "rf-4", icon: ScrollText, title: "Extorsão", description: "Defesa em casos de constrangimento para obtenção de vantagem indevida." }
      ],
      buttons: [
        {
          text: "Falar com Criminalista",
          icon: <MessageCircle className="w-4 h-4 mr-2" />,
          variant: "outline",
          message: "Olá! Preciso de defesa em um caso de Roubo/Furto."
        }
      ]
    },
    {
      id: "transito",
      icon: Car,
      title: "Crimes de Trânsito",
      description: "Defesa especializada em crimes de trânsito, da fase policial ao julgamento, com foco técnico em cada etapa do processo.",
      items: [
        { id: "tra-1", icon: Car, title: "Homicídio no Trânsito", description: "Defesa em acusações de homicídio culposo ou doloso na direção de veículo." },
        { id: "tra-2", icon: Wine, title: "Embriaguez ao Volante", description: "Defesa técnica em flagrantes e processos por embriaguez ao volante." },
        { id: "tra-3", icon: Activity, title: "Lesão Corporal no Trânsito", description: "Atuação em acusações de lesão corporal decorrente de acidente." },
        { id: "tra-4", icon: AlertTriangle, title: "Fuga do Local do Acidente", description: "Defesa em casos de omissão de socorro e evasão do local." }
      ],
      buttons: [
        {
          text: "Falar com Criminalista",
          icon: <MessageCircle className="w-4 h-4 mr-2" />,
          variant: "outline",
          message: "Olá! Preciso de defesa em um caso de Crime de Trânsito."
        }
      ]
    },
    {
      id: "flagrante",
      icon: Siren,
      title: "Prisão em Flagrante e Custódia",
      description: "Atendimento de urgência 24h. Atuação imediata para garantir seus direitos desde o primeiro minuto da prisão, em qualquer lugar do Brasil.",
      items: [
        { id: "fla-1", icon: Gavel, title: "Audiência de Custódia", description: "Atuação imediata para garantir direitos e buscar a soltura em audiência de custódia." },
        { id: "fla-2", icon: Unlock, title: "Relaxamento de Prisão", description: "Pedido de relaxamento em casos de prisão ilegal." },
        { id: "fla-3", icon: FileCheck, title: "Liberdade Provisória", description: "Requerimento de liberdade provisória com ou sem fiança." },
        { id: "fla-4", icon: Lock, title: "Prisão Preventiva", description: "Defesa técnica contra decretação ou manutenção de prisão preventiva." }
      ],
      buttons: [
        {
          text: "Atendimento Criminal Urgente",
          icon: <AlertTriangle className="w-4 h-4 mr-2" />,
          emoji: "🚨",
          variant: "destructive",
          message: "Olá! Tenho uma URGÊNCIA CRIMINAL (prisão em flagrante/custódia) e preciso de atendimento imediato."
        }
      ]
    },
    {
      id: "habeas-corpus",
      icon: Unlock,
      title: "Habeas Corpus e Recursos",
      description: "Atuação em tribunais superiores para reverter decisões injustas e garantir a liberdade e os direitos do acusado em todo o território nacional.",
      items: [
        { id: "hc-1", icon: Unlock, title: "Habeas Corpus", description: "Impetração de HC em tribunais para proteção da liberdade de locomoção." },
        { id: "hc-2", icon: ScrollText, title: "Apelação Criminal", description: "Recursos contra sentenças condenatórias em 1º grau." },
        { id: "hc-3", icon: Scale, title: "Recursos aos Tribunais Superiores", description: "Atuação em STJ e STF em recursos especiais e extraordinários." },
        { id: "hc-4", icon: FileCheck, title: "Revisão Criminal", description: "Ação para revisão de condenações já transitadas em julgado." }
      ],
      buttons: [
        {
          text: "Falar com Criminalista",
          icon: <MessageCircle className="w-4 h-4 mr-2" />,
          variant: "outline",
          message: "Olá! Preciso de orientação sobre Habeas Corpus ou recurso em processo criminal."
        }
      ]
    }
  ];

  return (
    <section id="services" className="relative py-12 lg:py-20 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 lg:mb-16"
        >
          <span className="text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider">Advocacia Criminal • Atuação Nacional</span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 mb-4">
            Qual é o seu <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">Problema Criminal?</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Somos 100% especializados em Direito Penal. Identifique sua situação abaixo e fale agora com um advogado criminalista, em qualquer estado do Brasil.
          </p>

        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 sm:p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-900/20"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-amber-600/0 group-hover:from-blue-600/10 group-hover:to-amber-600/10 rounded-2xl transition-all duration-300 pointer-events-none" />
              
              <div className="relative z-10 flex-grow">
                <div className="mb-4 sm:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner border border-blue-500/20">
                    <service.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-slate-400 mb-4 sm:mb-6 leading-relaxed font-medium text-sm sm:text-base">
                  {service.description}
                </p>

                {/* Expandable Service Items */}
                <div className="space-y-3 pt-4 border-t border-slate-700/50 mb-6 sm:mb-8">
                  {service.items.map((item) => (
                    <div key={item.id} className="border border-slate-700/50 rounded-lg overflow-hidden bg-slate-900/50">
                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-slate-800/50 transition-colors text-left group/item"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 flex-1">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            expandedItem === item.id 
                              ? 'from-amber-600/20 to-amber-800/20' 
                              : 'from-blue-600/20 to-blue-800/20'
                          }`}>
                            <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                              expandedItem === item.id ? 'text-amber-400' : 'text-blue-400'
                            }`} />
                          </div>
                          <span className={`font-semibold text-xs sm:text-sm transition-colors ${
                            expandedItem === item.id ? 'text-amber-100' : 'text-white'
                          }`}>
                            {item.title}
                          </span>
                        </div>
                        <ChevronDown 
                          className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform duration-300 shrink-0 ${
                            expandedItem === item.id ? 'rotate-180 text-amber-400' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {expandedItem === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 pt-1 sm:px-4 sm:pb-4 sm:pt-2 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-slate-700/30">
                              {item.description}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 mt-auto flex flex-col gap-3">
                {service.buttons.map((btn, btnIdx) => (
                  <Button
                    key={btnIdx}
                    onClick={() => handleWhatsApp(btn.message)}
                    variant={btn.variant === 'destructive' ? 'destructive' : btn.variant === 'outline' ? 'outline' : 'default'}
                    className={`w-full font-bold shadow-lg transition-all duration-300 h-auto py-3 text-sm sm:text-base
                      ${btn.variant === 'destructive' 
                        ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20' 
                        : btn.variant === 'outline'
                          ? 'border-blue-500 text-blue-400 hover:bg-blue-950 hover:text-white'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-blue-900/20 text-white'
                      }
                    `}
                  >
                    {btn.emoji && <span className="mr-2 text-lg">{btn.emoji}</span>}
                    {btn.icon}
                    <span className="whitespace-normal text-center leading-tight">{btn.text}</span>
                  </Button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default Services;