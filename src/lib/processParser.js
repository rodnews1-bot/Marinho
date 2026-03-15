/**
 * Utility to parse legal process data from pasted text (e.g., JusBrasil)
 * Handles multiple processes and associated andamentos.
 */

export const parseProcessData = (text) => {
  if (!text) return { error: "Texto vazio" };

  const result = {
    processes: [],
    andamentos: [],
    error: null
  };

  // 1. Regex definitions
  // Process Number (CNJ standard): NNNNNNN-DD.AAAA.J.TT.OOOO
  const processRegex = /\b\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}\b/g;
  
  // Date pattern: DD/MM/YYYY
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})/;

  // 2. Identify all unique process numbers first to use as anchors
  const processesFound = [...new Set(text.match(processRegex) || [])];

  if (processesFound.length === 0) {
    // Attempt fallback for raw numbers if no standard format found
    const rawMatches = text.match(/\b\d{20}\b/g);
    if (rawMatches) {
        processesFound.push(...[...new Set(rawMatches)]);
    }
  }

  // Add found processes to result structure
  processesFound.forEach(p => {
    result.processes.push({
      number: p,
      date_created: new Date().toISOString()
    });
  });

  // 3. Line-by-line parsing to associate andamentos with the correct process
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let currentProcessNumber = processesFound.length > 0 ? processesFound[0] : null;
  let currentAndamento = null;

  lines.forEach((line) => {
    // Check if line contains a process number, switch context
    const processMatchInLine = line.match(processRegex);
    if (processMatchInLine) {
        currentProcessNumber = processMatchInLine[0];
        // If we found a process number, this line is likely a header, not an andamento description
        // But we continue to see if it also has a date
    }

    const dateMatch = line.match(dateRegex);

    if (dateMatch) {
      // Save previous andamento if exists
      if (currentAndamento) {
        result.andamentos.push(currentAndamento);
      }

      // Start new andamento
      const parts = line.split(/[•-]/).map(p => p.trim());
      const dateStr = parts[0]; 
      
      let type = "Movimentação";
      let description = "";

      if (parts.length > 1) {
        type = parts[1];
        if (parts.length > 2) description = parts.slice(2).join(' - ');
      }

      currentAndamento = {
        process_number: currentProcessNumber, // Associate with current context
        date: dateStr,
        type: type,
        description: description
      };
    } else if (currentAndamento) {
      // Continuation of description
      // Avoid appending if the line is just the process number itself
      if (!line.includes(currentProcessNumber)) {
          if (currentAndamento.description) {
            currentAndamento.description += " " + line;
          } else if (!currentAndamento.type || currentAndamento.type === "Movimentação") {
            currentAndamento.type = line;
          } else {
            currentAndamento.description = line;
          }
      }
    }
  });

  // Push the last one
  if (currentAndamento) {
    result.andamentos.push(currentAndamento);
  }

  if (result.processes.length === 0 && result.andamentos.length === 0) {
    result.error = "Não foi possível identificar processos ou andamentos.";
  }

  return result;
};