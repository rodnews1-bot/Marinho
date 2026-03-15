// NOTE: Since Supabase is not connected yet, this file implements a 
// LocalStorage-based Mock DB to simulate the backend functionality.
// This allows the application to work immediately for prototyping.
// Once connected to Supabase, this content should be replaced with the real client.

const DB_KEY = 'marinho_adv_db';

// Initial Seed Data
const seedData = {
  clientes: [
    {
      id: 'c1',
      cpf: '12345678900', 
      nome: 'João da Silva',
      email: 'joao@email.com',
      telefone: '(65) 99999-9999',
      endereco: 'Rua das Flores, 123, Centro, Cuiabá - MT',
      created_at: new Date().toISOString()
    },
    {
      id: 'c_rodrigo',
      cpf: '90234197153', 
      nome: 'Rodrigo Moreira Marinho',
      email: 'rodrigo@marinho.adv.br',
      telefone: '(65) 90000-0000',
      endereco: 'Av. Historiador Rubens de Mendonça, Cuiabá - MT',
      created_at: new Date().toISOString()
    }
  ],
  processos: [
    {
      id: 'p1',
      cliente_id: 'c1',
      numero_processo: '0012345-88.2024.8.11.0001',
      descricao: 'Ação de Indenização por Danos Morais',
      status: 'Ativo',
      data_atualizacao: '2024-01-20T10:00:00Z',
      tribunal: 'TJMT - 2ª Vara Cível',
      created_at: new Date().toISOString()
    },
    {
      id: 'p2',
      cliente_id: 'c1',
      numero_processo: '5004321-12.2023.4.01.3600',
      descricao: 'Recurso de Apelação',
      status: 'Aguardando',
      data_atualizacao: '2023-12-15T14:30:00Z',
      tribunal: 'TRF1',
      created_at: new Date().toISOString()
    },
    {
      id: 'p3_rodrigo',
      cliente_id: 'c_rodrigo',
      numero_processo: '1000001-99.2024.8.11.0041',
      descricao: 'Inventário Judicial',
      status: 'Ativo',
      data_atualizacao: '2024-01-25T09:00:00Z',
      tribunal: 'TJMT - 1ª Vara de Família',
      created_at: new Date().toISOString()
    }
  ],
  andamentos: [
    {
      id: 'a1',
      processo_id: 'p1',
      data_andamento: '2024-01-20',
      tipo: 'Movimentação',
      descricao: 'Conclusos para Despacho',
      explicacao_simplificada: 'O processo foi enviado para o gabinete do juiz para que ele tome uma decisão ou dê uma ordem sobre o andamento do caso.',
      created_at: new Date().toISOString()
    },
    {
      id: 'a2',
      processo_id: 'p1',
      data_andamento: '2024-01-15',
      tipo: 'Publicação',
      descricao: 'Expedição de intimação para parte autora',
      explicacao_simplificada: 'O tribunal emitiu um aviso oficial para você (autor da ação) ou seu advogado sobre algo que aconteceu no processo.',
      created_at: new Date().toISOString()
    },
    {
      id: 'a3_rodrigo',
      processo_id: 'p3_rodrigo',
      data_andamento: '2024-01-25',
      tipo: 'Decisão',
      descricao: 'Nomeação de Inventariante deferida',
      explicacao_simplificada: 'O juiz aceitou o pedido para que você seja o responsável por administrar os bens durante o processo de inventário.',
      created_at: new Date().toISOString()
    }
  ],
  boletos: [
    {
      id: 'b1',
      cliente_id: 'c1',
      valor: 1500.00,
      data_vencimento: '2024-03-10',
      descricao: 'Honorários Iniciais - Parcela 1/3',
      numero_boleto: '34191.79001 01043.510047 91020.150008 1 89000000150000',
      link_pagamento: '',
      status: 'Pendente',
      created_at: new Date().toISOString()
    },
    {
      id: 'b2_rodrigo',
      cliente_id: 'c_rodrigo',
      valor: 5000.00,
      data_vencimento: '2024-02-15',
      descricao: 'Honorários de Êxito',
      numero_boleto: '00190.50095 40144.816069 06809.350314 3 37370000005000',
      link_pagamento: '',
      status: 'Pago',
      created_at: new Date().toISOString()
    }
  ],
  informacoes_caso: [
    {
      id: 'i1',
      cliente_id: 'c1',
      dados_relevantes: 'Audiência de conciliação pré-agendada para Março/2024. Necessário apresentar rol de testemunhas até 15/02.',
      contatos: 'Secretaria da Vara: (65) 3333-3333 | Assessor do Juiz: Dr. Fernando',
      documentos: 'Procuração, Cópia RG/CPF, Comprovante de Residência, Contrato de Honorários',
      created_at: new Date().toISOString()
    },
    {
      id: 'i2_rodrigo',
      cliente_id: 'c_rodrigo',
      dados_relevantes: 'Aguardando avaliação dos bens imóveis pelo oficial de justiça. Estimativa de conclusão em 30 dias.',
      contatos: 'Escritório Contábil Parceiro: (65) 98888-8888 (Falar com Ana) | Equipe Jurídica: Dra. Mariana',
      documentos: 'Certidões Negativas, Matrículas dos Imóveis Atualizadas',
      created_at: new Date().toISOString()
    }
  ],
  membros: [
    {
      id: 'm1_rodrigo',
      cliente_id: 'c_rodrigo',
      nome: 'Maria da Silva',
      funcao: 'Representante Legal',
      email: 'maria@email.com',
      telefone: '(65) 99999-0000',
      created_at: new Date().toISOString()
    }
  ]
};

// Initialize DB if empty or update if needed
const initDB = () => {
  const stored = localStorage.getItem(DB_KEY);
  if (!stored) {
    localStorage.setItem(DB_KEY, JSON.stringify(seedData));
    return seedData;
  }
  
  const db = JSON.parse(stored);
  // Ensure all tables exist
  ['clientes', 'processos', 'andamentos', 'boletos', 'informacoes_caso', 'membros'].forEach(table => {
      if (!db[table]) db[table] = seedData[table] || [];
  });
  
  // Update with Rodrigo data if missing (simple check for dev environment)
  if (!db.clientes.find(c => c.id === 'c_rodrigo')) {
      // Add client
      db.clientes.push(...seedData.clientes.filter(c => c.id === 'c_rodrigo'));
      // Add related data
      ['processos', 'andamentos', 'boletos', 'informacoes_caso', 'membros'].forEach(table => {
          if (seedData[table]) {
              // Filter items that belong to Rodrigo or processes of Rodrigo
              const itemsToAdd = seedData[table].filter(item => {
                 if (item.cliente_id === 'c_rodrigo') return true;
                 if (item.processo_id === 'p3_rodrigo') return true; 
                 return false;
              });
              // Only add if not already present (checking by ID)
              itemsToAdd.forEach(item => {
                  if (!db[table].find(existing => existing.id === item.id)) {
                      db[table].push(item);
                  }
              });
          }
      });
      
      localStorage.setItem(DB_KEY, JSON.stringify(db));
  }
  
  return db;
};

initDB();

const getDb = () => JSON.parse(localStorage.getItem(DB_KEY));
const saveDb = (data) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
  console.log('[Supabase Mock] Data persisted to LocalStorage');
};

// Enhanced Mock Client with Chainable Interface
class QueryBuilder {
  constructor(table, filters = [], modifiers = {}) {
    this.table = table;
    this.filters = filters;
    this.modifiers = modifiers;
  }

  eq(field, value) {
    this.filters.push({ type: 'eq', field, value });
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.modifiers.order = { column, ascending };
    return this;
  }

  single() {
    this.modifiers.single = true;
    return this;
  }

  limit(count) {
    this.modifiers.limit = count;
    return this;
  }

  async then(resolve, reject) {
    try {
      const result = await this.execute();
      resolve(result);
    } catch (error) {
      if (reject) reject(error);
    }
  }

  execute() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const db = getDb();
        let data = db[this.table] || [];

        // Apply filters
        for (const filter of this.filters) {
          if (filter.type === 'eq') {
            data = data.filter(item => {
               // Special clean comparison for CPF/CNPJ if needed, usually string exact match is safer for IDs
               if (filter.field === 'cpf') {
                   const cleanA = String(item[filter.field] || '').replace(/\D/g, '');
                   const cleanB = String(filter.value || '').replace(/\D/g, '');
                   return cleanA === cleanB;
               }
               // Loose equality to handle string/number ID mismatches
               return String(item[filter.field]) === String(filter.value);
            });
          }
        }

        // Apply Ordering
        if (this.modifiers.order) {
          const { column, ascending } = this.modifiers.order;
          data.sort((a, b) => {
            if (a[column] < b[column]) return ascending ? -1 : 1;
            if (a[column] > b[column]) return ascending ? 1 : -1;
            return 0;
          });
        }

        // Apply Single
        if (this.modifiers.single) {
          if (data.length === 0) {
            resolve({ data: null, error: { message: "No rows found", code: "PGRST116" } });
            return;
          }
          if (data.length > 1) {
             // Supabase single() warns if more than one, but returns first
             resolve({ data: data[0], error: null }); 
             return;
          }
          resolve({ data: data[0], error: null });
          return;
        }

        // Apply Limit
        if (this.modifiers.limit) {
          data = data.slice(0, this.modifiers.limit);
        }

        console.log(`[Supabase Mock] SELECT from ${this.table} - Found ${data.length} records`);
        resolve({ data, error: null });
      }, 300); // Simulate network latency
    });
  }
}

export const supabase = {
  from: (table) => {
    return {
      select: (columns) => new QueryBuilder(table),
      insert: (newData) => {
        return {
          then: (resolve) => {
            setTimeout(() => {
                const db = getDb();
                const tableData = db[table] || [];
                const items = newData.map(item => ({
                  id: Math.random().toString(36).substr(2, 9), 
                  created_at: new Date().toISOString(),
                  ...item
                }));
                tableData.push(...items);
                db[table] = tableData;
                saveDb(db);
                console.log(`[Supabase Mock] INSERT into ${table} - Added ${items.length} records`);
                resolve({ data: items, error: null });
            }, 300);
          }
        };
      },
      update: (updates) => {
        return {
           eq: (field, value) => {
             return {
                then: (resolve) => {
                    setTimeout(() => {
                        const db = getDb();
                        const tableData = db[table] || [];
                        const index = tableData.findIndex(item => String(item[field]) === String(value));
                        if (index !== -1) {
                          tableData[index] = { ...tableData[index], ...updates };
                          db[table] = tableData;
                          saveDb(db);
                          console.log(`[Supabase Mock] UPDATE ${table} - ID ${value}`);
                          resolve({ data: [tableData[index]], error: null });
                        } else {
                          console.warn(`[Supabase Mock] UPDATE failed - ${table} ID ${value} not found`);
                          resolve({ data: null, error: 'Not found' });
                        }
                    }, 300);
                }
             }
           }
        }
      },
      delete: () => {
         return {
            eq: (field, value) => {
               return {
                  then: (resolve) => {
                      setTimeout(() => {
                        const db = getDb();
                        const tableData = db[table] || [];
                        const initialLength = tableData.length;
                        
                        // Use loose equality for IDs to prevent type mismatch issues
                        const filtered = tableData.filter(item => String(item[field]) !== String(value));
                        
                        if (filtered.length !== initialLength) {
                          db[table] = filtered;
                          saveDb(db);
                          console.log(`[Supabase Mock] DELETE from ${table} - Removed ID ${value}`);
                          resolve({ data: true, error: null });
                        } else {
                          console.warn(`[Supabase Mock] DELETE failed - ${table} ID ${value} not found`);
                          resolve({ data: null, error: 'Not found' });
                        }
                      }, 300);
                  }
               }
            }
         }
      }
    };
  }
};