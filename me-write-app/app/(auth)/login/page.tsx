import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-card__title">HaqiZ</h1>
        <p className="login-card__subtitle">Private desk</p>
        <LoginForm />
      </div>
    </div>
  )
}
