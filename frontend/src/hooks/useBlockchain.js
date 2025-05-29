import { useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';

/**
 * Custom hook to access blockchain context
 * @returns {Object} Blockchain context with chain data and methods
 * @throws {Error} If used outside BlockchainProvider
 */
export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};