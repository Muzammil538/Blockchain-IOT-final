const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const getBlockchainData = async () => {
  const response = await fetch(`${API_URL}/blockchain`)
  if (!response.ok) {
    throw new Error('Failed to fetch blockchain data')
  }
  return response.json()
}

export const verifyDataOnChain = async (dataHash) => {
  const response = await fetch(`${API_URL}/verify?hash=${dataHash}`)
  if (!response.ok) {
    throw new Error('Verification failed')
  }
  return response.json()
}

export const uploadDataToBlockchain = async (file, token) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })

  if (!response.ok) {
    throw new Error('Upload failed')
  }
  return response.json()
}