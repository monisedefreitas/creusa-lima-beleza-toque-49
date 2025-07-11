// WhatsApp utility functions for better message handling

export const WHATSAPP_NUMBER = "+351964481966";

// Predefined message templates
export const WhatsAppMessages = {
  general: "Olá Creusa! Gostaria de saber mais sobre os seus serviços de estética e linfoterapia. Poderia me ajudar?",
  consultation: "Olá! Gostaria de agendar uma consulta personalizada. Quando teria disponibilidade?",
  linfoterapia: "Olá Creusa! Tenho interesse na linfoterapia especializada. Poderia me dar mais informações sobre os tratamentos?",
  technology: "Olá! Gostaria de saber mais sobre os tratamentos com tecnologia avançada (Hifu, Radiofrequência, Cavitação). Pode me ajudar?",
  prenatal: "Olá! Estou grávida e gostaria de saber sobre as massagens para gestantes. Quais são as opções disponíveis?",
  appointment: "Olá Creusa! Gostaria de marcar um agendamento. Quais são os horários disponíveis?",
  location: "Olá! Poderia me confirmar a localização exata do Espaço Sinergia em Carcavelos?",
  prices: "Olá! Gostaria de saber os valores dos tratamentos. Poderia me enviar uma tabela de preços?"
};

export const createWhatsAppLink = (message: string = WhatsAppMessages.general): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodedMessage}`;
};

export const openWhatsApp = (message?: string): void => {
  const link = createWhatsAppLink(message);
  window.open(link, '_blank');
};