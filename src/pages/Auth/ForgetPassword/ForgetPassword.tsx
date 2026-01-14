import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import loginImg from "../../../assets/ambiance-1.jpg";
import { Link, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../service/firebase';

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false); // âœ… new state for showing success card
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);

      // Redirect to login after 4 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12" style={{ backgroundColor: '#d4ccc0' }}>
          {/* Back Button */}
          <div className="mb-12">
            <button
              type='button'
              onClick={() => navigate('/')}
              className="flex items-center gap-2 font-serif text-base font-semibold transition-all hover:opacity-75 duration-300"
              style={{ color: '#3d5055' }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Site
            </button>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 data-aos="fade-right" className="text-4xl lg:text-5xl font-head font-bold mb-3" style={{ color: '#3d5055' }}>
              Forgot Password?
            </h1>
            <p className="text-base font-serif" style={{ color: '#6b7c7e' }}>
              Enter your email to receive reset instructions
            </p>
          </div>

          {/* Success Card */}
          {success && (
            <div
              className="mb-6 px-6 py-4 rounded-2xl bg-green-50 shadow-md"
              style={{ color: '#22543d', borderColor: '#38a169', backgroundColor: '#f0fff4' }}
            >
              <span className="font-head text-lg">âœ“ Reset email sent successfully!</span>
              <p className="text-sm mt-1">Please check your inbox and follow the instructions.</p>
            </div>
          )}

          {/* Error Card */}
          {error && (
            <div
              className="mb-6 px-6 py-4 rounded-2xl    shadow-md"
              style={{ color: '#742a2a', borderColor: '#e53e3e', backgroundColor: '#fff5f5' }}
            >
              <span className="font-head text-lg"> {   "Invalid email address"  }</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleReset}>
            <div className="space-y-6">
              {/* Email Input */}
              <div className="relative">
                <label data-aos="fade-right"
                  htmlFor="email"
                  className="block text-sm font-serif font-medium mb-2 tracking-wide"
                  style={{ color: '#5a7a82' }}
                >
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: '#6b7c7e' }}
                    strokeWidth={1.5}
                  />
                  <input
                    required
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 border-2 font-serif text-base transition-all duration-300 focus:outline-none focus:border-opacity-100"
                    style={{
                      backgroundColor: '#f5f1ed',
                      borderColor: '#b8aea0',
                      color: '#3d5055'
                    }}
                    disabled={loading || success}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-4 font-serif text-sm font-medium tracking-widest transition-all hover:opacity-85 duration-300"
                style={{
                  backgroundColor: '#3d5055',
                  color: '#f5f1ed'
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Email'}
              </button>
            </div>


             {/* login  naviagte */}
        <div className="mt-8 text-center">
          <p className="text-sm font-serif" style={{ color: '#6b7c7e' }}>
            Missed Up?{' '}
            <Link
              to={"/login"} 
              className="font-medium hover:opacity-70 transition-opacity"
              style={{ color: '#5a7a82' }}
            >
               Sign In
            </Link>
          </p>
        </div>
          </form>

          {/* Decorative */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: '#b8aea0' }}>
            <p className="text-xs font-serif text-center tracking-wide" style={{ color: '#6b7c7e' }}>
              Nothing beats the classic, From our hands to your plate
            </p>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <img
            src={loginImg}
            alt="Rubino's Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
          <div className="absolute bottom-12 left-12 right-12">
            <blockquote className="text-white">
              <p className="text-2xl lg:text-3xl font-head font-bold mb-3 leading-tight">
                "Come For The Pizza,<br />Stay For The Everything"
              </p>
              <p className="text-sm font-serif opacity-90">
                â€” Rubino's Restaurant
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgetPasswordPage;