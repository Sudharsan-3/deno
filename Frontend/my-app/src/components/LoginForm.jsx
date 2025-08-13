'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(form));
    console.log(res, "from login");

    if (res.meta.requestStatus === 'fulfilled') {
      router.push('/');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Register Link */}
        <p className="text-center text-sm mt-4">
          Don’t have an account?{' '}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}


// 'use client';

// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { login } from '../../src/redux/features/auth/authSlice';
// import { useRouter } from 'next/navigation';

// export default function LoginForm() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { loading, error, user } = useSelector((state) => state.auth);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await dispatch(login(form));
//     if (res.meta.requestStatus === 'fulfilled') {
//       router.push('/');
//     }
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <h2 className="text-xl font-bold mb-4">Login</h2>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//           className="border p-2"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//           className="border p-2"
//         />
//         {error && <p className="text-red-500">{error}</p>}
//         <button type="submit" className="bg-blue-500 text-white p-2">
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// }
