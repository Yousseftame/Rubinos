import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRegister } from '../../../hooks/Auth/useRegister';
import AuthInput from '../../../components/shared/AuthInput';
import AuthButton from '../../../components/shared/AuthButton';

const Register = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    showPassword,
    showConfirmPassword,
    handleSubmit,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility
  } = useRegister();

  return (
    <>
      {/* Welcome Text */}
      <div className="mb-10">
        <h1 data-aos="fade-right" className="text-4xl lg:text-5xl font-head font-bold mb-3" style={{ color: '#3d5055' }}>
          Create Account
        </h1>
        <p className="text-base font-serif" style={{ color: '#6b7c7e' }}>
          Join Rubino's today
        </p>
      </div>

      {/* Register Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Name Input */}
          <AuthInput
            id="name"
            label="FULL NAME"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            icon={User}
            required
          />

          {/* Email Input */}
          <AuthInput
            id="email"
            label="EMAIL ADDRESS"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            icon={Mail}
            required
          />

          {/* Password Input */}
          <AuthInput
            id="password"
            label="PASSWORD"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="*******"
            icon={Lock}
            required
            rightIcon={
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="hover:opacity-70 transition-opacity"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" style={{ color: '#6b7c7e' }} strokeWidth={1.5} />
                ) : (
                  <Eye className="w-5 h-5" style={{ color: '#6b7c7e' }} strokeWidth={1.5} />
                )}
              </button>
            }
          />

          {/* Confirm Password Input */}
          <AuthInput
            id="confirmPassword"
            label="CONFIRM PASSWORD"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="*******"
            icon={Lock}
            required
            rightIcon={
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="hover:opacity-70 transition-opacity"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" style={{ color: '#6b7c7e' }} strokeWidth={1.5} />
                ) : (
                  <Eye className="w-5 h-5" style={{ color: '#6b7c7e' }} strokeWidth={1.5} />
                )}
              </button>
            }
          />

          {/* Submit Button */}
          <AuthButton text="CREATE ACCOUNT" isLoading={isLoading} />
        </div>
      </form>

      {/* Sign In Link */}
      <div className="mt-8 text-center">
        <p className="text-sm font-serif" style={{ color: '#6b7c7e' }}>
          Already have an account?{' '}
          <Link
            to="/login" 
            className="font-medium hover:opacity-70 transition-opacity"
            style={{ color: '#5a7a82' }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;