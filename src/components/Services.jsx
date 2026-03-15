import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, ShieldCheck, DollarSign, Gavel, FileBarChart, HeartHandshake, MessageCircle, AlertTriangle, Car, ChevronDown, Shield, FileText, Wine, UserCheck, Armchair as Wheelchair, Heart, FileSearch, Users, Unlock, TrendingDown, Building2, Calculator, RefreshCcw, XCircle, FileCheck, Landmark, Divide, CalendarClock, TrendingUp, Activity, Accessibility, Briefcase, HeartCrack, UserX, Stethoscope, FileWarning, Undo2, Percent, HeartHandshake as Handshake, Banknote, ScrollText, AlertOctagon, ShieldAlert, BadgePercent, Lock, School, GraduationCap, Home, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProcessUploadModal from '@/components/ProcessUploadModal';
import { getWhatsAppLink } from '@/lib/whatsappConfig';

const Services = () => {
  const [expandedItem, setExpandedItem] = useState(null);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);

  const handleWhatsApp = (message) => {
    window.open(getWhatsAppLink(message), '_blank');
  };

  const toggleExpand = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const services = [
    {
      id: "penal",
      icon: Gavel,
      title: "Direito Penal",
      description: "Defesa técnica e combativa. Protegemos sua liberdade em inquéritos e processos com estratégias que buscam a verdade real dos fatos.",
      items: [
        { id: "penal-1", icon: FileSearch, title: "Defesa em Inquéritos", description: "Representação legal em fase investigativa" },
        { id: "penal-2", icon: Shield, title: "Audiências de Custódia", description: "Garantia de direitos em audiências de prisão" },
        { id: "penal-3", icon: Users, title: "Tribunal do Júri", description: "Estratégia de defesa em julgamentos populares" },
        { id: "penal-4", icon: Scale, title: "Recursos Superiores", description: "Apelações e recursos em tribunais superiores" },
        { id: "penal-5", icon: Unlock, title: "Habeas Corpus", description: "Proteção de liberdade e direitos fundamentais" },
        { id: "penal-6", icon: Banknote, title: "Crimes Financeiros", description: "Defesa em fraudes e crimes econômicos" },
        { id: "penal-7", icon: Lock, title: "Execução Penal", description: "Atuação especializada na fase de cumprimento da pena: progressão de regime, livramento condicional, remição de pena, indulto e comutação, além de pedidos de prisão domiciliar e garantia de assistência médica." }
      ],
      buttons: [
        {
          text: "Atendimento Criminal Urgente",
          icon: <AlertTriangle className="w-4 h-4 mr-2" />,
          emoji: "🚨",
          variant: "destructive",
          message: "Olá! Tenho uma URGÊNCIA CRIMINAL (prisão/custódia) e preciso de atendimento imediato."
        },
        {
          text: "Falar com Criminalista",
          icon: <MessageCircle className="w-4 h-4 mr-2" />,
          variant: "outline",
          message: "Olá! Gostaria de falar com um especialista sobre um inquérito ou processo criminal."
        }
      ]
    },
    {
      id: "tributario",
      icon: FileBarChart,
      title: "Direito Tributário",
      description: "Inteligência fiscal para reduzir custos e recuperar créditos. Defendemos seu patrimônio contra execuções fiscais abusivas.",
      items: [
        { id: "trib-1", icon: Calculator, title: "Planejamento Tributário", description: "Estratégias legais para otimizar carga fiscal" },
        { id: "trib-2", icon: ShieldAlert, title: "Defesa em Execuções", description: "Representação em execuções fiscais" },
        { id: "trib-3", icon: RefreshCcw, title: "Recuperação de Créditos", description: "Recuperação de impostos pagos indevidamente" },
        { id: "trib-4", icon: XCircle, title: "Anulação de Multas", description: "Contestação de multas e penalidades fiscais" },
        { id: "trib-5", icon: FileCheck, title: "Consultoria Fiscal", description: "Análise de obrigações e conformidade tributária" },
        { id: "trib-6", icon: Gavel, title: "Litígios Administrativos", description: "Defesa em processos administrativos fiscais" },
        { id: "trib-7", icon: Divide, title: "Parcelamento de Débitos", description: "Negociação de parcelamentos com Receita Federal" }
      ],
      buttons: [
        {
          text: "Execução Fiscal Urgente",
          emoji: "🚨",
          variant: "destructive",
          message: "Olá! Recebi uma Execução Fiscal e preciso de defesa urgente."
        }
      ]
    },
    {
      id: "previdenciario",
      icon: HeartHandshake,
      title: "Direito Previdenciário",
      description: "Garanta o melhor benefício possível. Planejamento previdenciário minucioso para assegurar sua tranquilidade no futuro.",
      items: [
        { id: "prev-1", icon: CalendarClock, title: "Planejamento de Aposentadoria", description: "Análise de melhor momento e modalidade de aposentadoria" },
        { id: "prev-2", icon: TrendingUp, title: "Revisão de Benefícios", description: "Revisão de benefícios para aumentar valor mensal" },
        { id: "prev-3", icon: Activity, title: "Auxílio-Doença/Invalidez", description: "Concessão e manutenção de benefícios por incapacidade" },
        { id: "prev-4", icon: Accessibility, title: "BPC/LOAS", description: "Benefício de Prestação Continuada para idosos e deficientes" },
        { id: "prev-5", icon: Briefcase, title: "Contribuinte Individual", description: "Orientação para autônomos e contribuintes individuais" },
        { id: "prev-6", icon: HeartCrack, title: "Pensão por Morte", description: "Concessão e revisão de pensões para dependentes" },
        { id: "prev-7", icon: Gavel, title: "Ação Judicial Previdenciária", description: "Ações contra INSS para concessão de benefícios" }
      ],
      buttons: [
        {
          text: "Falar com Previdenciário",
          variant: "default",
          message: "Olá! Gostaria de agendar um planejamento previdenciário ou revisar meu benefício."
        }
      ]
    },
    {
      id: "consumidor",
      icon: ShieldCheck,
      title: "Direito do Consumidor",
      description: "Não aceite abusos. Atuamos com firmeza contra bancos, seguradoras e empresas que desrespeitam seus direitos.",
      items: [
        { id: "cons-1", icon: Landmark, title: "Ações contra Bancos", description: "Cobrança de juros abusivos e tarifas indevidas" },
        { id: "cons-2", icon: UserX, title: "Negativação Indevida", description: "Remoção de restrições de crédito indevidas" },
        { id: "cons-3", icon: Stethoscope, title: "Planos de Saúde", description: "Cobertura de procedimentos negados indevidamente" },
        { id: "cons-4", icon: Scale, title: "Danos Morais", description: "Indenização por danos morais e materiais" },
        { id: "cons-5", icon: FileWarning, title: "Recall de Produtos", description: "Ações contra fabricantes por produtos defeituosos" },
        { id: "cons-6", icon: FileText, title: "Contratos Abusivos", description: "Anulação de cláusulas abusivas em contratos" },
        { id: "cons-7", icon: Undo2, title: "Direito de Arrependimento", description: "Exercício do direito de desistência em compras" }
      ],
      buttons: [
        {
          text: "Defender Meus Direitos",
          variant: "default",
          message: "Olá! Tive um problema de consumo (banco/negativação/plano de saúde) e quero defender meus direitos."
        }
      ]
    },
    {
      id: "dividas",
      icon: DollarSign,
      title: "Renegociação de Dívidas",
      description: "Recupere sua saúde financeira. Estratégias legais para reduzir juros abusivos e parcelar débitos de forma justa.",
      items: [
        { id: "div-1", icon: BadgePercent, title: "Renegociação de Crédito Consignado para Servidor Público", description: "Revisão e reestruturação completa de empréstimos consignados para servidores públicos (Federais, Estaduais e Municipais). Atuamos na redução de taxas de juros abusivas, alongamento de prazos e adequação da margem consignável, garantindo o equilíbrio financeiro sem comprometer a renda familiar." },
        { id: "div-2", icon: Percent, title: "Redução de Juros", description: "Negociação e redução de juros abusivos" },
        { id: "div-3", icon: Handshake, title: "Acordos Judiciais", description: "Celebração de acordos para parcelamento de dívidas" },
        { id: "div-4", icon: ShieldCheck, title: "Proteção Patrimonial", description: "Estratégias para proteger patrimônio de credores" },
        { id: "div-5", icon: RefreshCcw, title: "Refinanciamento de Dívidas", description: "Consolidação de múltiplas dívidas em uma" },
        { id: "div-6", icon: ScrollText, title: "Defesa em Ações de Cobrança", description: "Contestação de ações de cobrança abusivas" },
        { id: "div-7", icon: AlertOctagon, title: "Insolvência Civil", description: "Orientação em processos de insolvência" }
      ],
      buttons: [
        {
          text: "Resolver Dívidas Urgente",
          emoji: "🚨",
          variant: "destructive",
          message: "Olá! Preciso de ajuda URGENTE para renegociar dívidas e proteger meu patrimônio."
        }
      ]
    },
    {
      id: "autista",
      icon: Heart,
      title: "Direitos do Autista",
      description: "Garantimos os direitos e benefícios para pessoas autistas. Atuamos na obtenção de diagnóstico, benefícios previdenciários, inclusão escolar e proteção contra discriminação.",
      items: [
        { id: "aut-1", icon: Activity, title: "Diagnóstico e Laudo", description: "Obtenção de diagnóstico formal e laudo médico para comprovação do autismo" },
        { id: "aut-2", icon: Banknote, title: "Benefício de Prestação Continuada (BPC)", description: "Acesso ao BPC para pessoas autistas que atendem aos critérios de vulnerabilidade" },
        { id: "aut-3", icon: School, title: "Inclusão Escolar", description: "Garantia de matrícula e permanência em escolas regulares com suporte necessário" },
        { id: "aut-4", icon: GraduationCap, title: "Direito à Educação Especial", description: "Acesso a recursos e profissionais especializados na educação" },
        { id: "aut-5", icon: ShieldAlert, title: "Proteção contra Discriminação", description: "Defesa contra discriminação em ambientes escolares, profissionais e sociais" },
        { id: "aut-6", icon: CalendarClock, title: "Aposentadoria Especial", description: "Possibilidade de aposentadoria especial para autistas que trabalham" },
        { id: "aut-7", icon: Briefcase, title: "Direitos Trabalhistas para Autistas", description: "Proteção e direitos especiais no ambiente de trabalho" }
      ],
      buttons: [
        {
          text: "Direitos do Autista",
          variant: "default",
          message: "Olá! Preciso de orientação sobre os direitos do autista e benefícios disponíveis."
        }
      ]
    },
    {
      id: "concursos",
      icon: Scale,
      title: "Mandados de Segurança em Concursos Públicos",
      description: "Protegemos seus direitos em concursos públicos. Atuamos contra erros em provas, recursos administrativos, impugnações e mandados de segurança para garantir sua aprovação.",
      items: [
        { id: "conc-1", icon: FileWarning, title: "Impugnação de Questões", description: "Contestação de questões com erros ou ambiguidades nas provas" },
        { id: "conc-2", icon: Undo2, title: "Recursos Administrativos", description: "Interposição de recursos contra decisões da banca examinadora" },
        { id: "conc-3", icon: ScrollText, title: "Mandado de Segurança", description: "Ação judicial para proteger direitos líquidos e certos em concursos" },
        { id: "conc-4", icon: Shield, title: "Defesa contra Eliminação", description: "Defesa contra eliminação indevida do candidato no processo seletivo" },
        { id: "conc-5", icon: FileCheck, title: "Revisão de Notas", description: "Revisão e contestação de notas e gabaritos oficiais" },
        { id: "conc-6", icon: Accessibility, title: "Direitos de Candidatos PCD", description: "Proteção especial para candidatos com deficiência" },
        { id: "conc-7", icon: Gavel, title: "Ações contra Banca Examinadora", description: "Ações judiciais contra erros e irregularidades da banca" }
      ],
      buttons: [
        {
          text: "Falar com Especialista em Concursos",
          variant: "default",
          message: "Olá! Tenho dúvidas sobre meu concurso público e gostaria de falar com um advogado especialista."
        }
      ]
    },
    {
      id: "consultoria",
      icon: Briefcase,
      title: "Consultoria Jurídica",
      description: "Orientação jurídica especializada para seus negócios e questões pessoais. Oferecemos consultoria preventiva para evitar problemas legais e maximizar oportunidades.",
      items: [
        { id: "consult-1", icon: Building2, title: "Consultoria Empresarial", description: "Orientação jurídica para constituição, gestão e operação de empresas" },
        { id: "consult-2", icon: Home, title: "Consultoria Imobiliária", description: "Assessoria em transações imobiliárias, contratos e questões de propriedade" },
        { id: "consult-3", icon: FileText, title: "Consultoria Contratual", description: "Análise, elaboração e revisão de contratos comerciais e civis" },
        { id: "consult-4", icon: Users, title: "Consultoria Familiar", description: "Orientação em questões de direito de família, casamento e separação" },
        { id: "consult-5", icon: HeartHandshake, title: "Consultoria Sucessória", description: "Planejamento sucessório e orientação em questões de herança" },
        { id: "consult-6", icon: ShieldCheck, title: "Consultoria de Compliance", description: "Implementação de políticas de conformidade legal e regulatória" },
        { id: "consult-7", icon: Shield, title: "Consultoria Preventiva", description: "Análise preventiva para evitar problemas legais futuros" }
      ],
      buttons: [
        {
          text: "Contratar Consultoria Jurídica",
          variant: "default",
          message: "Olá! Gostaria de contratar uma consultoria jurídica especializada."
        }
      ]
    },
    {
      id: "traffic",
      icon: Car,
      title: "Multas, Apreensão e Direitos do Condutor",
      description: "Defesa completa para motoristas. Anulamos multas, defendemos contra suspensão de CNH e recuperamos veículos apreendidos.",
      items: [
        { id: "traffic-1", icon: Car, title: "Seu veículo foi apreendido pelo Banco?", description: "Advogado especialista com atuação rápida para suspender apreensões, contestar abusos no contrato de financiamento e recuperar seu veículo. Muitos bancos cometem erros na cobrança, nos juros ou na notificação. E é aí que entramos com a Defesa para anular a Apreensão do seu veículo." },
        { id: "traffic-2", icon: Shield, title: "Suspensão/Cassação CNH/PPD", description: "Buscamos erros capazes de anular a suspensão/cassação de CNH/PPD, com análises aprofundadas e qualificadas de todo o processo. Nada passa pelo radar da DS Trânsito!" },
        { id: "traffic-3", icon: FileText, title: "MULTAS", description: "Recorremos das suas multas, buscando não apenas a anulação, mas também, a adequada gestão de pontos, de modo a evitar o processo de suspensão da CNH." },
        { id: "traffic-4", icon: Wine, title: "Bafômetro", description: "Multa de lei seca tem solução! Trabalhamos não apenas no processo da multa, para evitar seu pagamento, mas também, no processo de suspensão de CNH, para evitar a perda do direito de dirigir" },
        { id: "traffic-5", icon: UserCheck, title: "Veículo vendido e não transferido", description: "Pressionamos o comprador a proceder com a transferência do carro e de todas as multas cometidas após a venda, sob pena de responder às autoridades competentes." },
        { id: "traffic-6", icon: Wheelchair, title: "Aquisição de carro para PCD", description: "Auxiliamos em todo o processo para aquisição de veículos com descontos de até 30%, desde o agendamento para junta médica do DETRAN, até a escolha do veículo ideal para o perfil do cliente." },
        { id: "traffic-7", icon: Heart, title: "Seguro DPVAT", description: "Garantimos o recebimento máximo de acordo com o seu caso, buscando um complemento, caso você já tenha recebido antes." }
      ],
      buttons: [
        {
          text: "Resolver Problema de Trânsito",
          variant: "default",
          message: "Olá! Quero resolver meu problema de Suspenção e Cassação de CNH, Recurso de Multa, aquisição de Carro PCD, Lei Seca, Veículo vendido e não transferido ou Seguro DPVAT."
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
          <span className="text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider">Expertise Jurídica</span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 mb-4">
            Soluções para Problemas <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">Complexos</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Não atuamos em tudo. Atuamos onde somos especialistas. Conheça nossas áreas de alta performance.
          </p>

          <Button 
            onClick={() => setIsProcessModalOpen(true)}
            variant="outline"
            className="mt-6 border-blue-500/50 text-blue-400 hover:text-white hover:bg-blue-600/20"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Adicionar Processo (Análise IA)
          </Button>
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

      <ProcessUploadModal 
        isOpen={isProcessModalOpen}
        onClose={() => setIsProcessModalOpen(false)}
      />
    </section>
  );
};

export default Services;