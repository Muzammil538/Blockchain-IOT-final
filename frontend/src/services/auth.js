import { auth, db } from './firebase' // You'll need to set up Firebase config

export const createUserDocument = async (userId, data) => {
  const userRef = db.collection('users').doc(userId)
  await userRef.set(data, { merge: true })
  return userRef
}

export const getUserDocument = async (userId) => {
  const userRef = db.collection('users').doc(userId)
  const doc = await userRef.get()
  return doc.exists ? doc.data() : null
}

export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback)
}

export const signInWithEmailAndPassword = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password)
}

export const createUserWithEmailAndPassword = (email, password) => {
  return auth.createUserWithEmailAndPassword(email, password)
}

export const signOut = () => {
  return auth.signOut()
}

export const getIdToken = (user) => {
  return user.getIdToken()
}