import { Link } from '@tanstack/react-router'
import { RegisterForm } from '../modules/auth/components/RegisterForm'
import { useState } from 'react'

export function RegisterPage() {
  const [step, setStep] = useState(1);
  
  return (
    <div className="h-screen w-full bg-gradient-to-b from-black to-gray-900 flex items-center justify-center text-white">
      <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
        {/* Add progress indicators */}
        <div className="flex justify-between mb-6">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`w-1/3 h-1 ${
                i <= step ? 'bg-white' : 'bg-white/20'
              } transition-colors duration-300 ${
                i < 3 ? 'mr-1' : ''
              }`}
            />
          ))}
        </div>
        
        <h2 className="text-3xl font-light mb-6 text-center">
          {step === 1 && 'Crear cuenta'}
          {step === 2 && 'Datos personales'}
          {step === 3 && 'Crear avatar'}
        </h2>
        
        <RegisterForm currentStep={step} onStepChange={setStep} />
        
        {step === 1 && (
          <p className="mt-6 text-center text-gray-400">
            Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-white hover:underline">
              Iniciar sesión
            </Link>
          </p>
        )}
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link to="/" className="text-gray-400 hover:text-white">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
