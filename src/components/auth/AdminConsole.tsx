import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { emailSignIn } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Shield } from 'lucide-react';

export default function AdminConsole() {
  const { setCurrentUser } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const user = await emailSignIn(email, password);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as any;
        if (userData.role === 'admin') {
          setCurrentUser({ ...userData, id: user.uid });
          navigate('/admin');
        } else {
          // Reject non-admins
          await import('../../lib/firebase').then(m => m.logout());
          setCurrentUser(null);
          setError('This account does not have admin access.');
        }
      } else {
        await import('../../lib/firebase').then(m => m.logout());
        setCurrentUser(null);
        setError('This account does not have admin access.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4 font-sans text-neutral-100">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-neutral-800 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-neutral-700">
          <Shield className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Admin Access</h1>
        <p className="text-neutral-400 mt-2 max-w-md mx-auto">
          Restricted area. Authorized personnel only.
        </p>
      </div>
      
      <div className="bg-neutral-800 p-8 rounded-2xl border border-neutral-700 shadow-xl w-full max-w-md flex flex-col items-center">
        {error && <div className="mb-4 p-3 bg-red-900/50 text-red-200 border border-red-800 text-sm rounded-lg w-full text-center">{error}</div>}
        
        <form onSubmit={handleAdminSignIn} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Admin Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-white"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
