export const legalTerms = {
  "Distribuição": "O início do processo. Quando a ação é entregue ao tribunal e recebe um número.",
  "Petição inicial": "O documento que começa o processo, onde o advogado explica o problema e faz os pedidos.",
  "Contestação": "A defesa do réu. É a resposta contra os pedidos feitos na ação.",
  "Sentença": "A decisão do juiz que encerra a primeira fase do processo, decidindo quem tem razão.",
  "Recurso": "Um pedido para que um tribunal superior revise a decisão do juiz.",
  "Julgado": "Decisão final.",
  "Despacho": "Ordem simples do juiz para dar andamento ao processo (ex: marcar data, pedir documento).",
  "Agravo": "Tipo de recurso contra decisões urgentes ou intermediárias do juiz antes da sentença final.",
  "Apelação": "O recurso principal contra a sentença final do juiz.",
  "Homologação": "Confirmação oficial do juiz sobre um acordo entre as partes.",
  "Revelia": "Ocorre quando o réu é avisado do processo mas não se defende no prazo.",
  "Liminar": "Decisão urgente e provisória no início do processo (ex: plano de saúde deve cobrir cirurgia agora).",
  "Audiência": "Reunião presencial ou online no tribunal com o juiz, as partes e os advogados.",
  "Trânsito em julgado": "Fim definitivo do processo. A decisão não pode mais ser mudada por nenhum recurso.",
  "Execução": "Fase em que se cobra o cumprimento forçado da decisão (ex: bloquear dinheiro, penhorar bens).",
  "Intimação": "Aviso oficial para que alguém faça algo ou saiba de algo no processo.",
  "Citação": "O primeiro aviso ao réu de que existe um processo contra ele.",
  "Concluso": "O processo está na mesa do juiz (ou computador) aguardando uma decisão.",
  "Suspenso": "O processo está parado temporariamente aguardando alguma condição."
};

export const getTermExplanation = (text) => {
  if (!text) return null;
  const lowerText = text.toLowerCase();
  const foundTerm = Object.keys(legalTerms).find(term => lowerText.includes(term.toLowerCase()));
  return foundTerm ? { term: foundTerm, explanation: legalTerms[foundTerm] } : null;
};