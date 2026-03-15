import React from 'react';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const scheduleLink = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ05LQBaGSMp19S1g1pQyxfnE5wQBnvoKBO2XmzKCqbKNYm0hIJ0oz1ySTgDHDzlwjBSq1NEKUe7";
  const phoneNumber = "5565992823630";
  const defaultMessage = "Olá! Vim pelo site do Marinho Advocacia e Assessoria e gostaria de falar com um advogado sobre meu caso.";
  
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`, '_blank');
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Mobile: Grid 2 cols (Brand full, Links split, Contact full) 
            Desktop: Grid 4 cols (1 each) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 lg:gap-8 mb-8 lg:mb-12">
          
          {/* Brand - Spans full width on mobile, 1 col on desktop */}
          <div className="col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-slate-800">
                <img
                  src="https://horizons-cdn.hostinger.com/fc1a8f30-56b6-4386-b03a-0cb5e72f383b/9674c8b7bad991a70e53c712f93d8d7d.png"
                  alt="Marinho Advocacia Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-white font-bold text-lg sm:text-xl">Marinho</div>
                <div className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-wider">Advocacia de Elite</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm lg:max-w-none">
              Escritório full-service focado em entregar resultados jurídicos de alta performance com ética, transparência e combatividade.
            </p>
            
            <div className="flex gap-4">
              <a
                href="https://instagram.com/marinhoadvocacia.oficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-900 border border-slate-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:border-transparent rounded-lg flex items-center justify-center transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </a>
              <a
                href="https://facebook.com/marinhoadvocacia.oficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:border-transparent rounded-lg flex items-center justify-center transition-all duration-300 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </a>
              <a
                href="https://youtube.com/marinhoadvocacia.oficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-900 border border-slate-800 hover:bg-red-600 hover:border-transparent rounded-lg flex items-center justify-center transition-all duration-300 group"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Navigation - Spans 1 col on mobile (left side of grid) */}
          <div className="col-span-1">
            <span className="text-white font-bold mb-6 block border-l-4 border-amber-500 pl-3">Navegação</span>
            <ul className="space-y-3">
              <li>
                <a href="#services" className="text-slate-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Serviços
                </a>
              </li>
              <li>
                <a href="#about" className="text-slate-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Sobre
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-slate-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Depoimentos
                </a>
              </li>
              <li>
                <a href="#contact" className="text-slate-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-2">
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  Agendar
                </a>
              </li>
            </ul>
          </div>

          {/* Areas - Spans 1 col on mobile (right side of grid) */}
          <div className="col-span-1">
            <span className="text-white font-bold mb-6 block border-l-4 border-blue-500 pl-3">Áreas</span>
            <ul className="space-y-3">
              <li className="text-slate-400 text-sm">Direito Penal</li>
              <li className="text-slate-400 text-sm">Tributário</li>
              <li className="text-slate-400 text-sm">Previdenciário</li>
              <li className="text-slate-400 text-sm">Consumidor</li>
              <li className="text-slate-400 text-sm">Dívidas</li>
            </ul>
          </div>

          {/* Contact - Spans full width on mobile, 1 col on desktop */}
          <div className="col-span-2 lg:col-span-1">
            <span className="text-white font-bold mb-6 block border-l-4 border-green-500 pl-3">Fale Conosco</span>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <div className="bg-slate-900 p-2 rounded-md border border-slate-800 shrink-0">
                  <Phone className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <span className="block text-xs text-slate-500">WhatsApp / Tel</span>
                  <span className="text-white hover:text-green-400 transition-colors cursor-pointer" onClick={handleWhatsApp}>(65) 99282-3630</span>
                </div>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <div className="bg-slate-900 p-2 rounded-md border border-slate-800 shrink-0">
                  <Mail className="w-4 h-4 text-blue-500" />
                </div>
                <div className="break-all sm:break-normal">
                  <span className="block text-xs text-slate-500">E-mail</span>
                  <a href="mailto:contato@marinhoadvogado.com.br" className="text-white hover:text-blue-400 transition-colors">contato@marinhoadvogado.com.br</a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <div className="bg-slate-900 p-2 rounded-md border border-slate-800 shrink-0">
                  <MapPin className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Localização</span>
                  <span className="text-white">Cuiabá/MT - Atuação Nacional</span>
                </div>
              </li>
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <div className="bg-slate-900 p-2 rounded-md border border-slate-800 shrink-0">
                  <Clock className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Atendimento</span>
                  <a href={scheduleLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 transition-colors cursor-pointer">Todos os dias: 24h</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-900 pt-6 sm:pt-8 mt-6 sm:mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left mb-4">
            <p className="text-slate-500 text-xs">
              © {currentYear} Marinho Advocacia e Assessoria. Todos os direitos reservados.
            </p>
            <p className="text-slate-600 text-[10px] max-w-md leading-relaxed">
              Este site não promete resultados. A advocacia é uma atividade de meio. OAB/MT 18.791.
            </p>
          </div>
          {/* Company Data */}
          <div className="text-center md:text-left mt-4 text-slate-500 text-xs space-y-1">
            <p>RODRIGO MARINHO SOCIEDADE INDIVIDUAL DE ADVOCACIA</p>
            <p>CNPJ: 64.168.071/0001-80</p>
            <p>Rua Beverly Hills, 154, Jardim Califórnia, Cuiabá-MT, CEP: 78070-364</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;