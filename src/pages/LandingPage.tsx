import { Link } from '@tanstack/react-router'

export function LandingPage() {
  return (
    <div className="h-screen w-full bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-6xl font-light tracking-wider mb-6">3D Virtual Store</h1>
      <p className="text-xl text-gray-300 mb-12 max-w-2xl text-center">
        Experience shopping in a whole new dimension. Browse products, try them on, and purchase - all in an immersive 3D environment.
      </p>
      
      <div className="flex gap-6">
        <Link 
          to="/store" 
          className="px-8 py-4 bg-white text-black text-lg font-medium rounded-sm hover:bg-opacity-90 transition-all"
        >
          Enter as Guest
        </Link>
        <Link 
          to="/login" 
          className="px-8 py-4 bg-transparent border border-white text-white text-lg font-medium rounded-sm hover:bg-white/10 transition-all"
        >
          Login
        </Link>
      </div>
    </div>
  )
}
