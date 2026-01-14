import  { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import loginImg from "../../../assets/ambiance-1.jpg"
import { Link, useNavigate,  } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../../../service/firebase';
import toast from 'react-hot-toast';



const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading , setIsLoading] = useState(false);



  const navigate = useNavigate();



  const handleSubmit =  async(e : React.FormEvent) => {

    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
       await userCredential.user.reload();
      const currentUser = auth.currentUser;
      

      
      toast.success("login sucess")
      navigate("/admin/categories")
      

      
      
    } catch (error :any) {
      console.log(error);
      toast.error("Invalid email or password. Please try again.");
       
      
    }
    finally {
      setIsLoading(false);
    }

    console.log('Login attempted with:', { email, password });
  };

  return (
    <section >
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      
      <div  className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12" style={{ backgroundColor: '#d4ccc0' }}>
        {/* Logo */}
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

        {/* Welcome Text */}
        <div className="mb-10">
          <h1 data-aos="fade-right" className="text-4xl lg:text-5xl font-head font-bold mb-3" style={{ color: '#3d5055' }}>
            Welcome Back
          </h1>
          <p className="text-base font-serif" style={{ color: '#6b7c7e' }}>
            Sign in to access your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          
        <div className="space-y-6">
          {/* Email Input */}
          <div className="relative">
            <label 
            data-aos="fade-right"
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
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <label 
            data-aos="fade-right"
              htmlFor="password" 
              className="block text-sm font-serif font-medium mb-2 tracking-wide"
              style={{ color: '#5a7a82' }}
            >
              PASSWORD
            </label>
            <div className="relative">
              <Lock 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" 
                style={{ color: '#6b7c7e' }}
                strokeWidth={1.5}
              />
              <input
              required
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3.5 border-2 font-serif text-base transition-all duration-300 focus:outline-none focus:border-opacity-100"
                style={{ 
                  backgroundColor: '#f5f1ed',
                  borderColor: '#b8aea0',
                  color: '#3d5055'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" style={{ color: '#6b7c7e' }} strokeWidth={1.5} />
                ) : (
                  <Eye className="w-5 h-5" style={{ color: '#6b7c7e' }} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label data-aos="fade-right" className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 border-2 mr-2 cursor-pointer"
                style={{ accentColor: '#3d5055' }}
              />
              <span className="text-sm font-serif" style={{ color: '#6b7c7e' }}>
                Remember me
              </span>
            </label>
            <Link 
              to={"/forget-password"}
              className="text-sm font-serif hover:opacity-70 transition-opacity"
              style={{ color: '#5a7a82' }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
           
            className="w-full py-4 font-serif text-sm font-medium tracking-widest transition-all hover:opacity-85 duration-300"
            style={{ 
              backgroundColor: '#3d5055',
              color: '#f5f1ed'
            }}
            disabled={isLoading}
          >
            { isLoading ? "Loading..." : "SIGN IN"}
          </button>
        </div>
        </form>


        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-sm font-serif" style={{ color: '#6b7c7e' }}>
            Don't have an account?{' '}
            <Link
              to={"/register"} 
              className="font-medium hover:opacity-70 transition-opacity"
              style={{ color: '#5a7a82' }}
            >
              Create one here
            </Link>
          </p>
        </div>

        {/* Decorative Element */}
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
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
        
        {/* Quote on Image */}
        <div  className="absolute bottom-12 left-12 right-12">
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

export default Login;