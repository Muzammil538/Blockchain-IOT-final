export const BLOCKCHAIN_CONSTANTS = {
  GENESIS_HASH: '00000000000000000000000000000000',
  HASH_ALGORITHM: 'SHA-256',
  BLOCK_TIME: 10000, // 10 seconds
  DIFFICULTY: 4 // Leading zeros required in hash
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  DEVICE: 'device'
};

export const UPLOAD_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  VERIFIED: 'verified',
  FAILED: 'failed'
};

export const ERROR_MESSAGES = {
  NETWORK: 'Network error occurred. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  DEFAULT: 'An unexpected error occurred.'
};

export const FILE_TYPES = {
  CSV: 'text/csv',
  JSON: 'application/json',
  TEXT: 'text/plain',
  BINARY: 'application/octet-stream'
};