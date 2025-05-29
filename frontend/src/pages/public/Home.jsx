import { Link } from 'react-router'
import { useAuth } from '../../hooks/useAuth'

export default function Home() {
  const { currentUser } = useAuth()
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Secure IoT Data with Blockchain
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Ensure the integrity and authenticity of your IoT data using our decentralized blockchain solution.
          Prevent tampering and unauthorized access with cryptographic verification.
        </p>
        <div className="space-x-4">
          {currentUser ? (
            <Link 
              to="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link 
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
              >
                Get Started
              </Link>
              <Link 
                to="/login"
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg text-lg font-medium"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 rounded-xl my-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Data Integrity",
                description: "Ensure your IoT data remains untampered with blockchain verification",
                icon: "🔒"
              },
              {
                title: "Real-time Verification",
                description: "Instantly verify the authenticity of any data point using cryptographic hashes",
                icon: "⚡"
              },
              {
                title: "Decentralized Storage",
                description: "Distributed ledger technology prevents single points of failure",
                icon: "🌐"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="space-y-12 max-w-4xl mx-auto">
          {[
            {
              step: "1",
              title: "Upload Your Data",
              description: "Securely upload your IoT data files through our encrypted connection"
            },
            {
              step: "2",
              title: "Blockchain Verification",
              description: "We generate a cryptographic hash and store it in the blockchain"
            },
            {
              step: "3",
              title: "Verify Anytime",
              description: "Check data integrity at any time by comparing with the blockchain record"
            }
          ].map((item) => (
            <div key={item.step} className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}