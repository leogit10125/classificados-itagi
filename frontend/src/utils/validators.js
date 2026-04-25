// frontend/src/utils/validators.js

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar senha (mínimo 6 caracteres)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Validar nome (mínimo 3 caracteres)
export const isValidName = (name) => {
  return name && name.trim().length >= 3;
};

// Validar telefone (opcional - pelo menos 10 dígitos)
export const isValidPhone = (phone) => {
  if (!phone) return true; // telefone é opcional
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
};

// Validar preço
export const isValidPrice = (price) => {
  return price && !isNaN(price) && parseFloat(price) > 0;
};

// Validar título (mínimo 5 caracteres)
export const isValidTitle = (title) => {
  return title && title.trim().length >= 5;
};

// Validar descrição (mínimo 10 caracteres)
export const isValidDescription = (description) => {
  return description && description.trim().length >= 10;
};

// Sanitizar inputs
export const sanitizeInput = (input) => {
  if (!input) return '';
  return input.replace(/[<>]/g, '');
};

// Formatar telefone enquanto digita
export const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};