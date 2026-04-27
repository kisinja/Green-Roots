import { AuthForm } from '@/components/ui/AuthForm'

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-[#163e16] mb-1">Create account</h1>
          <p className="text-gray-500">Join GreenRoots to order farm inputs online</p>
        </div>
        <AuthForm mode="register" />
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-green-700 font-semibold hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  )
}
