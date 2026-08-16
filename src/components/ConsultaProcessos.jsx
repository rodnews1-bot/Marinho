import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Scale, Clock, FileText, Building, Loader2, Volume2, Pause, ChevronRight, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const API_BASE = 'https://direitando.com.br/api/sites/publico/chuva';

function formatarCPF(valor) {
    const n = valor.replace(/\D/g, '');
    if (n.length <= 11) return n.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return n.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

function formatarData(dateStr) {
    if (!dateStr) return '';
    try {
        return new Date(dateStr).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    } catch { return ''; }
}

function StatusBadge({ status }) {
    const configs = {
        ativo: { bg: 'bg-green-500/20 text-green-300 border-green-500/30', label: 'Em andamento' },
        suspenso: { bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', label: 'Suspenso' },
        arquivado: { bg: 'bg-slate-500/20 text-slate-300 border-slate-500/30', label: 'Arquivado' },
        encerrado: { bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30', label: 'Encerrado' },
    };
    const cfg = configs[status] || configs.ativo;
    return (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${cfg.bg}`}>
            {cfg.label}
        </span>
    );
}

export default function ConsultaProcessos() {
    const [cpfInput, setCpfInput] = useState('');
    const [cpfBusca, setCpfBusca] = useState('');
    const [processos, setProcessos] = useState([]);
    const [loadingProcessos, setLoadingProcessos] = useState(false);
    const [processoSelecionado, setProcessoSelecionado] = useState(null);
    const [andamentos, setAndamentos] = useState([]);
    const [loadingAndamentos, setLoadingAndamentos] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [erroProcessos, setErroProcessos] = useState('');
    const [explicandoAndamento, setExplicandoAndamento] = useState(null);
    const [explicacoesAndamentos, setExplicacoesAndamentos] = useState({});

    const explicarAndamento = async (andamento) => {
        const id = andamento.id;
        if (explicacoesAndamentos[id]) {
            setExplicacoesAndamentos(prev => { const n = { ...prev }; delete n[id]; return n; });
            return;
        }
        setExplicandoAndamento(id);
        try {
            const res = await fetch(`${API_BASE}/explicar-andamento`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    descricao: andamento.descricao,
                    tipo: andamento.tipo,
                    processoNumero: processoSelecionado?.numero_cnj,
                }),
            });
            const data = await res.json();
            setExplicacoesAndamentos(prev => ({ ...prev, [id]: data.explicacao }));
        } catch {
            setExplicacoesAndamentos(prev => ({ ...prev, [id]: 'Não foi possível gerar a explicação.' }));
        } finally {
            setExplicandoAndamento(null);
        }
    };

    const buscarProcessos = async () => {
        const digits = cpfInput.replace(/\D/g, '');
        if (digits.length < 11) return;
        setProcessoSelecionado(null);
        setAndamentos([]);
        setExplicacoesAndamentos({});
        setErroProcessos('');
        setCpfBusca(cpfInput);
        setLoadingProcessos(true);
        try {
            const res = await fetch(`${API_BASE}/processos?cpf=${encodeURIComponent(digits)}`);
            if (!res.ok) throw new Error('Erro na consulta');
            const data = await res.json();
            setProcessos(Array.isArray(data) ? data : []);
        } catch {
            setErroProcessos('Não foi possível consultar. Tente novamente.');
            setProcessos([]);
        } finally {
            setLoadingProcessos(false);
        }
    };

    const selecionarProcesso = async (processo) => {
        setProcessoSelecionado(processo);
        setAndamentos([]);
        setLoadingAndamentos(true);
        const digits = cpfBusca.replace(/\D/g, '');
        try {
            const res = await fetch(
                `${API_BASE}/processos/${processo.id}/andamentos?cpf=${encodeURIComponent(digits)}`
            );
            if (!res.ok) throw new Error('Erro');
            const data = await res.json();
            setAndamentos(Array.isArray(data) ? data : []);
        } catch {
            setAndamentos([]);
        } finally {
            setLoadingAndamentos(false);
        }
    };

    const reproduzirAndamentos = () => {
        if (!('speechSynthesis' in window) || andamentos.length === 0) return;
        if (isPlaying) {
            speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }
        const texto = andamentos.slice(0, 5).map(a =>
            `${a.tipo || a.descricao || 'Andamento'}, em ${formatarData(a.data_andamento)}.`
        ).join(' ');
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlaying(false);
        speechSynthesis.speak(utterance);
        setIsPlaying(true);
    };

    const mostrarResultados = cpfBusca.replace(/\D/g, '').length >= 11;

    return (
        <section className="relative py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-slate-950">
            {/* Glow decorativo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <span className="text-amber-400 font-bold text-xs sm:text-sm uppercase tracking-wider">
                        Transparência Total
                    </span>
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 mb-4">
                        Consulte seus{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
                            Processos
                        </span>
                    </h2>
                    <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
                        Digite seu CPF ou CNPJ para acompanhar seus processos em tempo real.
                    </p>
                </motion.div>

                {/* Campo de busca */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="max-w-md mx-auto mb-10"
                >
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                        <label className="text-sm font-semibold mb-3 block text-slate-300">
                            Digite seu CPF ou CNPJ
                        </label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="000.000.000-00"
                                value={cpfInput}
                                onChange={(e) => setCpfInput(formatarCPF(e.target.value))}
                                onKeyDown={(e) => e.key === 'Enter' && buscarProcessos()}
                                className="flex-1 bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-blue-500 h-11"
                            />
                            <Button
                                onClick={buscarProcessos}
                                disabled={cpfInput.replace(/\D/g, '').length < 11 || loadingProcessos}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-4 h-11"
                            >
                                {loadingProcessos
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <Search className="w-4 h-4" />
                                }
                            </Button>
                        </div>
                        {erroProcessos && (
                            <p className="text-red-400 text-xs mt-2">{erroProcessos}</p>
                        )}
                    </div>
                </motion.div>

                {/* Resultados */}
                {mostrarResultados && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                    >
                        {/* Lista de Processos */}
                        <div className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
                            <div className="p-5 border-b border-slate-700/50">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Scale className="w-5 h-5 text-blue-400" />
                                    Seus Processos
                                </h3>
                            </div>
                            <div className="p-4">
                                {loadingProcessos ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                                    </div>
                                ) : processos.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500">
                                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">Nenhum processo encontrado</p>
                                        <p className="text-sm mt-1">Verifique se o CPF está correto</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {processos.map(processo => (
                                            <div
                                                key={processo.id}
                                                onClick={() => selecionarProcesso(processo)}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                                                    processoSelecionado?.id === processo.id
                                                        ? 'border-blue-500 bg-blue-600/10 shadow-md shadow-blue-900/20'
                                                        : 'border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/50'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between mb-2 gap-2">
                                                    <span className="font-mono text-xs font-bold text-slate-100 leading-tight">
                                                        {processo.numero_cnj}
                                                    </span>
                                                    <StatusBadge status={processo.status} />
                                                </div>
                                                <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                                                    {processo.assunto || processo.classe_processual || 'Processo judicial'}
                                                </p>
                                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                                    <Building className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{processo.tribunal || 'Tribunal não informado'}</span>
                                                </div>
                                                {processoSelecionado?.id === processo.id && (
                                                    <div className="flex items-center gap-1 text-xs text-blue-400 mt-2">
                                                        <ChevronRight className="w-3 h-3" />
                                                        <span>Visualizando movimentações</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Andamentos */}
                        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
                            {processoSelecionado ? (
                                <>
                                    <div className="p-5 border-b border-slate-700/50">
                                        <div className="flex items-start justify-between gap-3 flex-wrap">
                                            <div>
                                                <h3 className="text-lg font-bold text-white">
                                                    Processo {processoSelecionado.numero_cnj}
                                                </h3>
                                                <p className="text-sm text-slate-400 mt-0.5">
                                                    {processoSelecionado.tribunal}
                                                    {processoSelecionado.vara ? ` • ${processoSelecionado.vara}` : ''}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <StatusBadge status={processoSelecionado.status} />
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={reproduzirAndamentos}
                                                    disabled={loadingAndamentos || andamentos.length === 0}
                                                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs h-8"
                                                >
                                                    {isPlaying
                                                        ? <><Pause className="w-3 h-3 mr-1" />Pausar</>
                                                        : <><Volume2 className="w-3 h-3 mr-1" />Ouvir</>
                                                    }
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h4 className="font-semibold text-slate-200 flex items-center gap-2 mb-5">
                                            <Clock className="w-4 h-4 text-amber-400" />
                                            Histórico de Movimentações
                                        </h4>
                                        {loadingAndamentos ? (
                                            <div className="flex items-center justify-center py-12">
                                                <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                                            </div>
                                        ) : andamentos.length === 0 ? (
                                            <p className="text-slate-500 text-center py-12">
                                                Nenhuma movimentação registrada
                                            </p>
                                        ) : (
                                            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 custom-scroll">
                                                {andamentos.map((andamento, index) => (
                                                    <div key={andamento.id} className="relative pl-6 pb-4 border-l-2 border-slate-700 last:pb-0 last:border-transparent">
                                                        <div
                                                            className={`absolute left-[-5px] top-0.5 w-2.5 h-2.5 rounded-full border-2 ${
                                                                index === 0
                                                                    ? 'bg-blue-500 border-blue-400'
                                                                    : 'bg-slate-700 border-slate-600'
                                                            }`}
                                                        />
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <span className="text-xs text-slate-500">
                                                                {formatarData(andamento.data_andamento)}
                                                            </span>
                                                            <button
                                                                onClick={() => explicarAndamento(andamento)}
                                                                disabled={explicandoAndamento === andamento.id}
                                                                className="ml-auto flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded-full transition-colors disabled:opacity-50"
                                                            >
                                                                {explicandoAndamento === andamento.id
                                                                    ? <Loader2 className="w-3 h-3 animate-spin" />
                                                                    : <Bot className="w-3 h-3" />}
                                                                {explicacoesAndamentos[andamento.id] ? 'Ocultar' : 'Entender'}
                                                            </button>
                                                        </div>
                                                        {andamento.tipo && (
                                                            <p className="font-semibold text-sm text-slate-100">
                                                                {andamento.tipo}
                                                            </p>
                                                        )}
                                                        {andamento.descricao && (
                                                            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                                                                {andamento.descricao}
                                                            </p>
                                                        )}
                                                        {explicacoesAndamentos[andamento.id] && (
                                                            <div className="mt-2 p-2.5 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                                    <Bot className="w-3 h-3 text-blue-400" />
                                                                    <span className="text-xs text-blue-400 font-medium">Explicação em linguagem simples</span>
                                                                </div>
                                                                <p className="text-slate-300 text-xs leading-relaxed">{explicacoesAndamentos[andamento.id]}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-slate-500 px-6">
                                    <Scale className="w-16 h-16 mb-4 opacity-20" />
                                    <p className="text-lg font-semibold text-slate-400">Selecione um processo</p>
                                    <p className="text-sm text-center mt-1">
                                        Clique em um processo ao lado para ver o histórico de movimentações
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
