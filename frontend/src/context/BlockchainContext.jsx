import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getBlockchainData, verifyDataOnChain } from '../services/blockchain'
import { toast } from 'react-hot-toast'

const BlockchainContext = createContext()

export function BlockchainProvider({ children }) {
  const [blockchain, setBlockchain] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    totalBlocks: 0,
    lastBlockTimestamp: null,
    dataHashes: 0
  })

  const fetchBlockchain = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getBlockchainData()
      setBlockchain(data.chain)
      
      setStats({
        totalBlocks: data.chain.length,
        lastBlockTimestamp: data.chain[data.chain.length - 1]?.timestamp,
        dataHashes: data.chain.filter(block => block.data?.data_hash).length
      })
    } catch (error) {
      toast.error('Failed to fetch blockchain data')
      console.error('Blockchain fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const verifyData = async (dataHash) => {
    try {
      setIsLoading(true)
      const result = await verifyDataOnChain(dataHash)
      
      if (!result.verified) {
        toast.error('Data verification failed')
        return { verified: false }
      }
      
      toast.success('Data verified successfully!')
      return result
    } catch (error) {
      toast.error('Verification error: ' + error.message)
      return { verified: false }
    } finally {
      setIsLoading(false)
    }
  }

  const getLatestBlocks = (count = 5) => {
    return blockchain.slice(-count).reverse()
  }

  const getBlockByHash = (hash) => {
    return blockchain.find(block => block.hash === hash)
  }

  useEffect(() => {
    fetchBlockchain()
    
    // Refresh blockchain every 30 seconds
    const interval = setInterval(fetchBlockchain, 30000)
    return () => clearInterval(interval)
  }, [fetchBlockchain])

  const value = {
    blockchain,
    isLoading,
    stats,
    fetchBlockchain,
    verifyData,
    getLatestBlocks,
    getBlockByHash
  }

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  )
}

export function useBlockchain() {
  return useContext(BlockchainContext)
}