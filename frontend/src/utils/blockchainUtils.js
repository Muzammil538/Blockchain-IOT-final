import { BLOCKCHAIN_CONSTANTS } from './constants';

export const calculateBlockHash = (index, previousHash, timestamp, data) => {
  const blockString = `${index}${previousHash}${timestamp}${JSON.stringify(data)}`;
  return crypto.subtle.digest(BLOCKCHAIN_CONSTANTS.HASH_ALGORITHM, 
    new TextEncoder().encode(blockString))
    .then(hashBuffer => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    });
};

export const validateChain = (chain) => {
  if (!Array.isArray(chain)) return false;
  if (chain.length === 0) return false;

  // Check genesis block
  const genesis = chain[0];
  if (genesis.index !== 0 || 
      genesis.previous_hash !== BLOCKCHAIN_CONSTANTS.GENESIS_HASH) {
    return false;
  }

  // Check subsequent blocks
  for (let i = 1; i < chain.length; i++) {
    const current = chain[i];
    const previous = chain[i - 1];

    if (current.index !== previous.index + 1) return false;
    if (current.previous_hash !== previous.hash) return false;
    
    // In a real app, you would verify the hash calculation here
  }

  return true;
};

export const mineBlock = async (blockData, difficulty = BLOCKCHAIN_CONSTANTS.DIFFICULTY) => {
  let nonce = 0;
  let hash = '';
  const prefix = '0'.repeat(difficulty);

  while (true) {
    hash = await calculateBlockHash(
      blockData.index,
      blockData.previous_hash,
      blockData.timestamp,
      { ...blockData.data, nonce }
    );

    if (hash.startsWith(prefix)) {
      return { ...blockData, hash, nonce };
    }

    nonce++;
  }
};