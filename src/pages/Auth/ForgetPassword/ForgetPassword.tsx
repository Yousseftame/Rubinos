import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../../../hooks/Auth/useForgotPassword';
import AuthInput from '../../../components/shared/AuthInput';
import AuthButton from '../../../components/shared/AuthButton';

const ForgotPassword = () => {
  const {
    email,
    setEmail,
    loading,
    success,
    error,
    handleSubmit
  } = useForgotPassword();

  return (
    <>
      {/* Welcome Text */}
      <div className="mb-6">
        <h1 data-aos="fade-right" className="text-4xl lg:text-5xl font-head font-bold mb-3" style={{ color: '#3A5F58' }}>
          Forgot Password?
        </h1>
        <p className="text-base " style={{ color: '#3A5F58' }}>
          Enter your email to receive reset instructions
        </p>
      </div>

      {/* Success Card */}
      {success && (
        <div
          className="mb-6 px-6 py-4 rounded-2xl bg-green-50 shadow-md"
          style={{ color: '#22543d', borderColor: '#38a169', backgroundColor: '#f0fff4' }}
        >
          <span className="font-head text-lg">✓ Reset email sent successfully!</span>
          <p className="text-sm mt-1">Please check your inbox and follow the instructions.</p>
        </div>
      )}

      {/* Error Card */}
      {error && (
        <div
          className="mb-6 px-6 py-4 rounded-2xl shadow-md"
          style={{ color: '#742a2a', borderColor: '#e53e3e', backgroundColor: '#fff5f5' }}
        >
          <span className="font-head text-lg">Invalid email address</span>
        </div>
      )}

      {/* Forgot Password Form */}
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

          {/* Submit Button */}
          <AuthButton
            text="Send Reset Email" 
            isLoading={loading} 
            disabled={success}
          />
        </div>

        {/* Login Navigate */}
        <div className="mt-8 text-center">
          <p className="text-sm " style={{ color: '#3A5F58' }}>
            Missed Up?{' '}
            <Link
              to="/login" 
              className="font-medium hover:opacity-70 transition-opacity"
              style={{ color: '#3A5F58' }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

export default ForgotPassword;