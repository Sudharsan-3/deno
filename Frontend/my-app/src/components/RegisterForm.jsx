'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/features/auth/authSlice';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res =  dispatch(register(form));
    if (res.meta.requestStatus === 'fulfilled') {
      router.push('/login');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-green-600 text-white p-2 rounded">
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}



