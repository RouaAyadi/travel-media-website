"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUser, useUserContext } from "../../../store/User";

const Register = () => {
    const { dispatch } = useUserContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [bio, setBio] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUser(dispatch, { email, password, firstname, lastname, phonenumber, bio });
            router.push('/');
        } catch (error) {
            console.error('Failed to register:', error);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className='relative flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-950 via-blue-200 to-blue-100 p-4'>
            <div className='flex items-stretch max-w-3xl w-full'>
                {/* Image */}
                <div className='flex-shrink-0 w-1/2'>
                    <img src="/image5.png" alt="Register Image" className='w-full h-full object-cover rounded-l-md' />
                </div>
                {/* Form */}
                <div className='relative w-full max-w-md bg-white shadow-md rounded-r-md border border-gray-300 p-4'>
                    <p className='text-3xl font-sans-serif leading-none text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 uppercase font-bold'>
                        Register
                    </p>
                    <p className='text-xl font-bold font-sans-serif leading-none text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 uppercase pt-4'>
                        Welcome to TravelMedia
                    </p>
                   
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='flex gap-x-2 mb-4 mt-2'>
                            <div className='flex flex-col w-full'>
                                <label htmlFor="first" className='text-gray-700 font-medium font-sans-serif text-sm'>First name</label>
                                <input
                                    type='text'
                                    id="first"
                                    name="first"
                                    className="border border-gray-300 p-2 w-full h-8 text-gray-900 placeholder-gray-400 rounded-md text-sm"
                                    placeholder="Your First name"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='flex flex-col w-full'>
                                <label htmlFor="last" className='text-gray-700 font-medium font-sans-serif text-sm'>Last name</label>
                                <input
                                    type='text'
                                    id="last"
                                    name="last"
                                    className="border border-gray-300 p-2 w-full h-8 text-gray-900 placeholder-gray-400 rounded-md text-sm"
                                    placeholder="Your Last name"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className='flex flex-col mb-4'>
                            <label htmlFor="number" className='text-gray-700 font-medium font-sans-serif text-sm'>Phone number</label>
                            <input
                                type='text'
                                id="number"
                                name="number"
                                className="border border-gray-300 p-2 w-full h-8 text-gray-900 placeholder-gray-400 rounded-md text-sm"
                                placeholder="Your Phone number"
                                value={phonenumber}
                                onChange={(e) => setPhonenumber(e.target.value)}
                                required
                            />
                        </div>
                        <div className='flex flex-col mb-4'>
                            <label htmlFor="email" className='text-gray-700 font-medium font-sans-serif text-sm'>Email</label>
                            <input
                                type='email'
                                id="email"
                                name="email"
                                autoComplete="email"
                                className="border border-gray-300 p-2 w-full h-8 text-gray-900 placeholder-gray-400 rounded-md text-sm"
                                placeholder="Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className='flex flex-col mb-4'>
                            <label htmlFor="password" className='text-gray-700 font-medium font-sans-serif text-sm'>Password</label>
                            <input
                                type='password'
                                id="password"
                                name="password"
                                className="border border-gray-300 p-2 w-full h-8 text-gray-900 placeholder-gray-400 rounded-md text-sm"
                                placeholder="Your Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className='flex flex-col mb-4'>
                            <label htmlFor="bio" className='text-gray-700 font-medium font-sans-serif text-sm'>BIO</label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows="3"
                                className="block w-full border border-gray-300 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder-gray-400 rounded-md text-sm"
                                placeholder="Write about yourself"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            ></textarea>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className='flex justify-center'>
                            <button
                                type='submit'
                                name='sign'
                                className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 font-bold text-white rounded-md p-2 h-auto w-full sm:w-auto sm:px-8 text-sm focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                Sign-up
                            </button>
                        </div>
                    </form>
                    <div className="flex justify-between mt-4">
                        <Link href="/log" className="text-sm text-gray-600 hover:underline">
                            Already have an account? Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
