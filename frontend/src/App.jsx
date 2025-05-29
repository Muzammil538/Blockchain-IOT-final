import { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import { Toaster } from 'react-hot-toast'
import routes from './routes'
import Navbar from './components/ui/Navbar'
import Footer from './components/ui/Footer'
import Loader from './components/ui/Loader'
import { AuthProvider } from './context/AuthContext'
import { BlockchainProvider } from './context/BlockchainContext'

function App() {
  return (
    <AuthProvider>
      <BlockchainProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow container mx-auto px-4 py-8">
              <Suspense fallback={<Loader fullPage />}>
                <Routes>
                  {routes.map((route, index) => (
                    <Route 
                      key={index} 
                      path={route.path} 
                      element={route.element} 
                    />
                  ))}
                </Routes>
              </Suspense>
            </main>
            
            <Footer />
            <Toaster position="top-right" />
          </div>
        </Router>
      </BlockchainProvider>
    </AuthProvider>
  )
}

export default App