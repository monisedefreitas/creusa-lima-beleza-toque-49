
export const formatPortuguesePhone = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // Se começa com 351 (código do país)
  if (numbers.startsWith('351')) {
    if (numbers.length <= 3) {
      return `+${numbers}`;
    } else if (numbers.length <= 6) {
      return numbers.replace(/(\d{3})(\d+)/, '+$1 $2');
    } else if (numbers.length <= 9) {
      return numbers.replace(/(\d{3})(\d{3})(\d+)/, '+$1 $2 $3');
    } else {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
    }
  }
  
  // Número nacional (9 dígitos)
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 6) {
    return numbers.replace(/(\d{3})(\d+)/, '$1 $2');
  } else if (numbers.length <= 9) {
    return numbers.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3');
  } else {
    // Se tem mais de 9 dígitos, trunca
    return numbers.slice(0, 9).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
};

export const validatePortuguesePhone = (phone: string): boolean => {
  const numbers = phone.replace(/\D/g, '');
  
  // Aceita números com código do país (+351) ou nacionais (9 dígitos)
  if (numbers.startsWith('351')) {
    return numbers.length === 12; // 351 + 9 dígitos
  }
  
  return numbers.length === 9 && numbers.startsWith('9');
};

export const isValidPortuguesePhone = (phone: string): { isValid: boolean; message?: string } => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, message: 'Telefone é obrigatório' };
  }
  
  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.startsWith('351')) {
    if (numbers.length !== 12) {
      return { isValid: false, message: 'Formato internacional deve ter 12 dígitos (+351 XXX XXX XXX)' };
    }
    const nationalPart = numbers.slice(3);
    if (!nationalPart.startsWith('9')) {
      return { isValid: false, message: 'Número deve começar com 9' };
    }
  } else {
    if (numbers.length !== 9) {
      return { isValid: false, message: 'Número nacional deve ter 9 dígitos' };
    }
    if (!numbers.startsWith('9')) {
      return { isValid: false, message: 'Número deve começar com 9' };
    }
  }
  
  return { isValid: true };
};
