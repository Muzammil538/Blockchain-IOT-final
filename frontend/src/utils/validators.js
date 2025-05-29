export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return re.test(password);
};

export const validateBlockchainData = (data) => {
  if (!data) return false;
  return (
    typeof data.index === 'number' &&
    typeof data.previous_hash === 'string' &&
    typeof data.hash === 'string' &&
    typeof data.timestamp === 'string' &&
    typeof data.data === 'object'
  );
};

export const validateMetadata = (metadata) => {
  if (!metadata) return false;
  const requiredFields = [
    'user_id',
    'timestamp',
    'data_hash',
    'url',
    'size'
  ];
  return requiredFields.every(field => field in metadata);
};

export const validateUserInput = (input) => {
  if (!input) return false;
  return (
    typeof input.name === 'string' && input.name.trim().length >= 2 &&
    validateEmail(input.email) &&
    validatePassword(input.password)
  );
};