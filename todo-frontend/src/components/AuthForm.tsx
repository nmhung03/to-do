import React, { useState } from 'react';
import { register, login } from '../services/authService';

interface AuthFormProps {
  onAuth: (token: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuth }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      let token: string;
      if (isRegister) {
        token = await register(username, email, password);
      } else {
        token = await login(email, password);
      }
      onAuth(token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-center text-2xl font-bold mb-4">
          {isRegister ? 'Register' : 'Login'}
        </h2>
        {error && (
          <div className="mb-4 text-red-600 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setError(''); setIsRegister(!isRegister); }}
            className="text-blue-500 underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
