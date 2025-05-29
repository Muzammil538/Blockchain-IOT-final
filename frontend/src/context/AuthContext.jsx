import { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../services/firebase' // Adjust the import path as necessary
import { toast } from 'react-hot-toast'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const userCredential = await auth.signInWithEmailAndPassword(email, password)
      setCurrentUser(userCredential.user)
      toast.success('Logged in successfully!')
      return userCredential.user
    } catch (error) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password, name) => {
    try {
      setLoading(true)
      const userCredential = await auth.createUserWithEmailAndPassword(email, password)
      
      // Update user profile with display name
      await userCredential.user.updateProfile({
        displayName: name
      })
      
      // Create user document in Firestore
      await auth.createUserDocument(userCredential.user.uid, {
        email,
        name,
        createdAt: new Date(),
        role: 'user'
      })

      setCurrentUser({
        ...userCredential.user,
        displayName: name
      })
      
      toast.success('Account created successfully!')
      return userCredential.user
    } catch (error) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await auth.signOut()
      setCurrentUser(null)
      toast.success('Logged out successfully!')
    } catch (error) {
      toast.error(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAdmin: currentUser?.email === 'admin@iotblockchain.com' // Simple admin check
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export  { AuthContext };