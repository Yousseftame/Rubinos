import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import loginImg from "../../../assets/ambiance-1.jpg";
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../../service/firebase';
import toast from 'react-hot-toast';
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../service/firebase";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading , setIsLoading] = useState(false);

  const navigate = useNavigate();


  // register submit 
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    // 1. Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // 2. Update display name (Auth)
    await updateProfile(user, {
      displayName: name,
    });

    // 3. Save user to Firestore (UID as document ID)
    await setDoc(doc(db, "admins", user.uid), {
      uid: user.uid,
      name: name,
      email: user.email,
      role: "admin",
      status: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    toast.success("Account created successfully");
    navigate("/login");
  } catch (error: any) {
    console.error(error);
    toast.error(error.message || "Registration failed");
  }
  finally{
    setIsLoading(false);
  }
};


  return (
    <section>
      <div className="min-h-screen flex">
        {/* Left Side */}
        <div
          className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-12"
          style={{ backgroundColor: '#d4ccc0' }}
        >
          {/* Back Button */}
          <div className="mb-12">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 font-serif text-base font-semibold transition-all hover:opacity-75 duration-300"
              style={{ color: '#3d5055' }}
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Site
            </button>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h1  data-aos="fade-right"
              className="text-4xl lg:text-5xl font-head font-bold mb-3"
              style={{ color: '#3d5055' }}
            >
              Create Account
            </h1>
            <p className="text-base font-serif" style={{ color: '#6b7c7e' }}>
              Join Rubino's today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">

              {/* Name */}
              <div>
                <label data-aos="fade-right"
                  className="block text-sm font-serif font-medium mb-2"
                  style={{ color: '#5a7a82' }}
                >
                  FULL NAME
                </label>
                <div className="relative">
                  <User  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" 
                style={{ color: '#6b7c7e' }}
                strokeWidth={1.5} />
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3.5 border-2 font-serif"
                    style={{
                      backgroundColor: '#f5f1ed',
                      borderColor: '#b8aea0',
                      color: '#3d5055',
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label  data-aos="fade-right"
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
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 border-2 font-serif"
                    style={{
                      backgroundColor: '#f5f1ed',
                      borderColor: '#b8aea0',
                      color: '#3d5055',
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label data-aos="fade-right" className="block text-sm font-serif font-medium mb-2" style={{ color: '#5a7a82' }}>
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 -5" 
                style={{ color: '#6b7c7e' }}
                strokeWidth={1.5}/>
                  <input
                   placeholder="*******"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 border-2 font-serif"
                    style={{
                      backgroundColor: '#f5f1ed',
                      borderColor: '#b8aea0',
                      color: '#3d5055',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label data-aos="fade-right" className="block text-sm font-serif font-medium mb-2" style={{ color: '#5a7a82' }}>
                  CONFIRM PASSWORD
                </label>
                <div className="relative">
                  <Lock  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" 
                style={{ color: '#6b7c7e' }}
                strokeWidth={1.5} />
                  <input
                   placeholder="*******"
                    required
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 border-2 font-serif"
                    style={{
                      backgroundColor: '#f5f1ed',
                      borderColor: '#b8aea0',
                      color: '#3d5055',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                className="w-full py-4 font-serif tracking-widest"
                style={{ backgroundColor: '#3d5055', color: '#f5f1ed' }}
                disabled={isLoading}
              >
               {isLoading ? "Loading..." : " CREATE ACCOUNT"}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm font-serif" style={{ color: '#6b7c7e' }}>
              Already have an account?{' '}
              <Link to="/login"  className="font-medium hover:opacity-70 transition-opacity"
              style={{ color: '#5a7a82' }}>
                Sign in
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

export default Register;