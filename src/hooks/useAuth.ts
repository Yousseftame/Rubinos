import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../service/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useAuthContext } from '../store/AuthContext/AuthContext';

export const useAuth = () => {
  const { setUser, setLoading, setError, clearError } = useAuthContext();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    clearError();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await userCredential.user.reload();
      setUser(auth.currentUser);
      toast.success('Login successful');
      navigate('/admin/categories');
    } catch (error: any) {
      const errorMsg = error.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : error.message || 'Login failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    clearError();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'admins', user.uid), {
        uid: user.uid,
        name,
        email: user.email,
        role: 'admin',
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setUser(user);
      toast.success('Account created successfully');
      navigate('/login');
    } catch (error: any) {
      const errorMsg = error.message || 'Registration failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    clearError();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Reset email sent successfully');
      return true;
    } catch (error: any) {
      const errorMsg = error.code === 'auth/user-not-found'
        ? 'Email address not found'
        : error.message || 'Failed to send reset email';
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error: any) {
      toast.error('Logout failed');
    }
  };

  return { login, register, resetPassword, logout };
};