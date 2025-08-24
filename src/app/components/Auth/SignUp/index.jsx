'use client'
import Link from 'next/link'
import Logo from '../../Layout/Header/Logo'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const SignUp = ({ setIsSignUpOpen, setIsSignInOpen }) => {  

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function onRegister(e) {
    try {
      e.preventDefault();
      setErr(null);
      setLoading(true);

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        setErr(data?.error || 'Failed to register');
      } else {
        setIsSignUpOpen(false);
        // Auto login 
        const result = await (await import('next-auth/react')).signIn('credentials', {
          email,
          password,
          redirect: '/dashboard',
        });

        if (result?.error) {
          toast.error('Something went wrong!', {
            progressClassName: 'bg-orange-500'
          })
          return;
        }
        toast('Successfully Registered!', {
          progressClassName: 'bg-orange-500'
        })
        router.push('/dashboard');
      }
    } catch (e) {
      console.error(e);
      setErr('Something went wrong');
      setLoading(false);
    }
  }

  return (
    <>
      <div className='mb-10 text-center mx-auto inline-block'>
        <Logo />
      </div>

      <form onSubmit={onRegister}>
        <div className='mb-[22px]'>
          <input
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            type='text'
            placeholder='Name'
            name='name'
            required
            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
          />
        </div>
        <div className='mb-[22px]'>
          <input
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            type='email'
            placeholder='Email'
            name='email'
            required
            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
          />
        </div>
        <div className='mb-[22px]'>
          <input
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            type='password'
            placeholder='Password'
            name='password'
            required
            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
          />
        </div>
        <div className='mb-9'>
          <button
            disabled={loading}
            type='submit'
            className='flex w-full items-center text-18 font-medium text-white justify-center rounded-md bg-primary px-5 py-3 text-darkmode transition duration-300 ease-in-out hover:bg-transparent hover:text-primary border-primary border'>
            {loading ? 'Creating Account' : 'Sign Up'} 
          </button>
          <span className='text-red-500'>{err}</span>
        </div>
      </form>

      <p className='text-body-secondary text-black/60 text-base'>
        Already have an account?
        <Link onClick={(e) => {
          e.preventDefault();
          setIsSignUpOpen(false);
          setIsSignInOpen(true)
        }} href='/' className='pl-2 text-primary hover:underline'>
          Sign In
        </Link>
      </p>
    </>
  )
}

export default SignUp
