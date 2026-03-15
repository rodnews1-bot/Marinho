export const WHATSAPP_NUMBER = "5565992823630";

/**
 * URL Encodes a message for WhatsApp
 * @param {string} text 
 * @returns {string}
 */
export const encodeWhatsAppMessage = (text) => {
  return encodeURIComponent(text);
};

/**
 * Generates a full WhatsApp link
 * @param {string} message - The message to pre-fill
 * @param {string} [phoneNumber] - Optional phone number override
 * @returns {string}
 */
export const getWhatsAppLink = (message, phoneNumber = WHATSAPP_NUMBER) => {
  const encodedMessage = encodeWhatsAppMessage(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

export const DEFAULT_CONTACT_MESSAGE = "Olá, tenho uma dúvida que precisa ser esclarecida com um advogado da Marinho Advocacia";