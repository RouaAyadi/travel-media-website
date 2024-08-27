"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoginUser, useUserContext } from "../../../store/User";

const Login = () => {
    const { dispatch, state } = useUserContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    console.log(state.isAuth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await LoginUser(dispatch, { email, password });
            router.push('/');
        } catch (error) {
            console.error('Failed to Login:', error);
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className='relative flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-950 via-blue-200 to-white p-8'>
            <div className='flex items-stretch max-w-4xl w-full'>
                {/* Image */}
                <div className='flex-shrink-0 w-1/2'>
                    <img src="/image5.png" alt="Login Image" className='w-full h-full object-cover rounded-l-lg' />
                </div>
                {/* Form */}
                <div className='relative w-full max-w-lg bg-white shadow-2xl rounded-r-lg border border-gray-300 p-8'>
                    <p className='text-4xl font-sans-serif leading-none text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 uppercase font-bold'>
                        Log-in
                    </p>
                    <p className='text-3xl font-bold font-sans-serif leading-none text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 uppercase pt-12'>
                        Welcome to TravelMedia
                    </p>
                    <div className='flex w-16 h-1 mb-8 mx-auto'></div>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='flex flex-col mb-4'>
                            <label htmlFor="email" className='text-gray-700 font-medium font-sans-serif'>Email</label>
                            <input
                                type='email'
                                id="email"
                                name="email"
                                autoComplete="email"
                                className="border border-gray-300 p-2 w-full h-10 text-gray-900 placeholder-gray-400 rounded-md"
                                placeholder="Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className='flex flex-col mb-4'>
                            <label htmlFor="password" className='text-gray-700 font-medium font-sans-serif'>Password</label>
                            <input
                                type='password'
                                id="password"
                                name="password"
                                className="border border-gray-300 p-2 w-full h-10 text-gray-900 placeholder-gray-400 rounded-md"
                                placeholder="Your Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className='flex justify-center'>
                            <button
                                type='submit'
                                name='log'
                                className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 font-bold text-white rounded-md p-2 h-auto w-full sm:w-auto sm:px-10 focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 transition duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                Log-in
                            </button>
                        </div>
                    </form>
                    <div className="flex justify-between mt-4">
                        <Link href="/forgot-password" className="text-sm text-p-200 hover:underline">
                            Forgot Password?
                        </Link>
                        <Link href="/register" className="text-sm text-gray-700 hover:underline">
                            Don't have an account? Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
