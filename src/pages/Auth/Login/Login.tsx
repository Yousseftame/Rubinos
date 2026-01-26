import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLogin } from '../../../hooks/Auth/useLogin';
import AuthInput from '../../../components/shared/AuthInput';
import AuthButton from '../../../components/shared/AuthButton';


const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    showPassword,
    handleSubmit,
    togglePasswordVisibility
  } = useLogin();

  return (
    <>
      {/* Welcome Text */}
      <div className="mb-10">
        <h1 data-aos="fade-right" className="text-4xl lg:text-5xl font-head font-bold mb-3" style={{ color: '#3A5F58' }}>
          Welcome Back
        </h1>
        <p className="text-base " style={{ color: '#3A5F58' }}>
          Sign in to access your account
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
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
            placeholder="Enter your password"
            icon={Lock}
            required
            rightIcon={
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="hover:opacity-70 transition-opacity"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" style={{ color: '#3A5F58' }} strokeWidth={1.5} />
                ) : (
                  <Eye className="w-5 h-5" style={{ color: '#3A5F58' }} strokeWidth={1.5} />
                )}
              </button>
            }
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-end">
            {/* <label data-aos="fade-right" className="flex items-center cursor-pointer">
              <input 
              disabled
                type="checkbox" 
                className="w-4 h-4 border-2 mr-2 cursor-pointer"
                style={{ accentColor: '#3d5055' }}
              />
              <span className="text-sm " style={{ color: '#6b7c7e' }}>
                Remember me
              </span>
            </label> */}
            <Link 
              to="/forget-password"
              className="text-sm  hover:opacity-70 transition-opacity"
              style={{ color: '#3A5F58' }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <AuthButton text="SIGN IN" isLoading={isLoading} />
        </div>
      </form>

      {/* Sign Up Link */}
      {/* <div className="mt-8 text-center">
        <p className="text-sm " style={{ color: '#6b7c7e' }}>
          Don't have an account?{' '}
          <Link
            to="/register" 
            className="font-medium hover:opacity-70 transition-opacity"
            style={{ color: '#5a7a82' }}
          >
            Create one here
          </Link>
        </p>
      </div> */}
    </>
  );
};

export default Login;