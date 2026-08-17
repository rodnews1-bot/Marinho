import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Youtube, Loader2, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWhatsAppLink } from '@/lib/whatsappConfig';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_PLAYLIST_ID = import.meta.env.VITE_YOUTUBE_PLAYLIST_ID;
const YOUTUBE_CHANNEL_URL = 'https://youtube.com/@rodnews';

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState('loading');
  const [activeVideoId, setActiveVideoId] = useState(null);

  const handleWhatsApp = () => {
    window.open(getWhatsAppLink('Olá! Vi os vídeos do canal do Marinho Advocacia e gostaria de falar sobre o meu caso.'), '_blank');
  };

  useEffect(() => {
    if (!YOUTUBE_API_KEY || !YOUTUBE_PLAYLIST_ID) {
      setStatus('unconfigured');
      return;
    }

    const fetchVideos = async () => {
      try {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=25&playlistId=${YOUTUBE_PLAYLIST_ID}&key=${YOUTUBE_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Falha ao buscar vídeos do YouTube');
        const data = await response.json();

        const seenIds = new Set();
        const seenTitles = new Set();
        const parsed = (data.items || [])
          .filter((item) => {
            const title = item.snippet?.title;
            const videoId = item.snippet?.resourceId?.videoId;
            if (!videoId || title === 'Private video' || title === 'Deleted video') return false;
            if (seenIds.has(videoId)) return false;
            seenIds.add(videoId);
            return true;
          })
          .map((item) => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            thumbnail:
              item.snippet.thumbnails?.maxres?.url ||
              item.snippet.thumbnails?.high?.url ||
              item.snippet.thumbnails?.medium?.url,
            publishedAt: item.snippet.publishedAt,
          }))
          .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
          .filter((video) => {
            const normalizedTitle = video.title.trim().toLowerCase();
            if (seenTitles.has(normalizedTitle)) return false;
            seenTitles.add(normalizedTitle);
            return true;
          })
          .slice(0, 12);

        setVideos(parsed);
        setStatus('ready');
      } catch (error) {
        console.error('Erro ao carregar vídeos do YouTube:', error);
        setStatus('error');
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    document.body.style.overflow = activeVideoId ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeVideoId]);

  if (status === 'unconfigured' && !import.meta.env.DEV) {
    return null;
  }

  return (
    <section id="videos" className="relative py-12 lg:py-20 bg-slate-900 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 lg:mb-16"
        >
          <span className="text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2">
            <Youtube className="w-4 h-4" /> Direto do Canal
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 mb-4">
            Conteúdo que <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">Esclarece e Protege</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Explicações diretas sobre casos reais de Direito Penal, direitos do preso e estratégias de defesa. Acompanhe os últimos vídeos do canal.
          </p>
        </motion.div>

        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-400" />
            <span className="text-sm">Carregando os últimos vídeos...</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 text-center max-w-md mx-auto">
            <Youtube className="w-10 h-10 mb-3 text-slate-600" />
            <p className="text-sm">Não foi possível carregar os vídeos agora. Enquanto isso, visite o canal diretamente.</p>
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-red-400 hover:text-red-300 font-semibold text-sm underline underline-offset-4"
            >
              Ir para o canal no YouTube
            </a>
          </div>
        )}

        {status === 'unconfigured' && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 text-center max-w-md mx-auto border border-dashed border-slate-700 rounded-2xl">
            <Youtube className="w-10 h-10 mb-3 text-slate-600" />
            <p className="text-sm">
              Galeria de vídeos aguardando configuração (VITE_YOUTUBE_API_KEY e VITE_YOUTUBE_PLAYLIST_ID no .env).
            </p>
          </div>
        )}

        {status === 'ready' && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {videos.map((video, index) => (
              <motion.button
                key={video.id}
                type="button"
                onClick={() => setActiveVideoId(video.id)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                whileHover={{ y: -5 }}
                className="group relative flex flex-col text-left bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-red-500/50 transition-all duration-300 shadow-lg hover:shadow-red-900/20"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/50 transition-colors flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 sm:w-14 sm:h-14 text-white/90 drop-shadow-lg group-hover:scale-110 group-hover:text-red-500 transition-all duration-300" />
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                    {video.title}
                  </h3>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {status === 'ready' && videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-10 lg:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-red-400 font-semibold text-sm sm:text-base transition-colors"
            >
              <Youtube className="w-5 h-5" />
              Ver todos os vídeos no canal
            </a>
            <span className="hidden sm:block text-slate-700">|</span>
            <Button
              onClick={handleWhatsApp}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-900/20"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Meu caso é parecido, quero falar com um advogado
            </Button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {activeVideoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveVideoId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveVideoId(null)}
                className="absolute -top-10 right-0 sm:-right-2 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-sm"
                aria-label="Fechar vídeo"
              >
                <X className="w-5 h-5" /> Fechar
              </button>
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-black">
                <iframe
                  key={activeVideoId}
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`}
                  title="Vídeo do canal Marinho Advocacia"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VideoGallery;