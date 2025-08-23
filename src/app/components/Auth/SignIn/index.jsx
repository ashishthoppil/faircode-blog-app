'use client'
import Link from 'next/link'
import Logo from '../../Layout/Header/Logo'
import { useState } from 'react'

const Signin = ({ setIsSignInOpen, setIsSignUpOpen }) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  
  return (
    <>
      <div className='mb-10 text-center mx-auto inline-block'>
        <Logo />
      </div>

      <form>
        <div className='mb-[22px]'>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            placeholder='Email'
            
            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
          />
        </div>
        <div className='mb-[22px]'>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            placeholder='Password'
            
            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
          />
        </div>
        <div className='mb-9'>
          <button
            
            type='submit'
            className='bg-primary w-full py-3 rounded-lg text-18 font-medium border text-white border-primary hover:text-primary hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out'>
            Sign In 
          </button>
          <span className='text-red-500'>{err}</span>
        </div>
      </form>
      <p className='text-black text-base'>
        Not a member yet?{' '}
        <Link onClick={(e) => {
          e.preventDefault();
          setIsSignUpOpen(true);
          setIsSignInOpen(false)
        }} href='/' className='text-primary hover:underline'>
          Sign Up
        </Link>
      </p>
    </>
  )
}

export default Signin
