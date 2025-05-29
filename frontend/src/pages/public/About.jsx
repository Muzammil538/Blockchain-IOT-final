export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">About Our Blockchain IoT Solution</h1>
      
      <div className="prose prose-lg">
        <p className="mb-6">
          Our platform leverages blockchain technology to provide an immutable, decentralized ledger 
          for IoT data verification. In an era where data integrity is paramount, our solution ensures 
          that your IoT device data remains tamper-proof and verifiable.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="mb-6">
          To create trust in IoT ecosystems by providing a transparent and secure method for 
          verifying data integrity. We believe that blockchain technology is the key to solving 
          data authenticity challenges in distributed IoT networks.
        </p>

        <h2 className="text-2xl font-semibold mb-4">The Technology</h2>
        <p className="mb-6">
          We utilize a Python-based blockchain implementation that creates cryptographic hashes 
          of your IoT data and stores them in an immutable ledger. Each data upload generates 
          a unique fingerprint that can be verified against the blockchain at any time.
        </p>

        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3">Key Benefits:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>End-to-end data integrity verification</li>
            <li>Tamper-evident record keeping</li>
            <li>Decentralized architecture with no single point of failure</li>
            <li>Real-time verification capabilities</li>
            <li>Secure cryptographic hashing algorithms</li>
          </ul>
        </div>

        <h2 className="text-2xl font-semibold mb-4">For IoT Developers</h2>
        <p>
          Our platform provides APIs and developer tools to integrate blockchain verification 
          directly into your IoT applications. Ensure your device data maintains its integrity 
          from sensor to storage with our easy-to-implement solution.
        </p>
      </div>
    </div>
  )
}