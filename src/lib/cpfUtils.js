export const cleanCPF = (cpf) => {
  if (!cpf) return '';
  return cpf.replace(/\D/g, '');
};

export const formatCPF = (cpf) => {
  const cleaned = cleanCPF(cpf);
  return cleaned
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const validateCPFStructure = (cpf) => {
  const cleaned = cleanCPF(cpf);
  return cleaned.length === 11;
};