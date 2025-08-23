'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import Signin from '../../Auth/SignIn'
import SignUp from '../../Auth/SignUp'
import { Icon } from '@iconify/react/dist/iconify.js'

const Header = () => {

  const [navbarOpen, setNavbarOpen] = useState(false)
  const [sticky, setSticky] = useState(false)
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)

  const signInRef = useRef(null)
  const signUpRef = useRef(null)
  const mobileMenuRef = useRef(null)

  const [user, setUser] = useState();


  const handleScroll = () => {
    setSticky(window.scrollY >= 20)
  }

  const handleClickOutside = (event) => {
    if (
      signInRef.current &&
      !signInRef.current.contains(event.target)
    ) {
      setIsSignInOpen(false)
    }
    if (
      signUpRef.current &&
      !signUpRef.current.contains(event.target)
    ) {
      setIsSignUpOpen(false)
    }
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target) &&
      navbarOpen
    ) {
      setNavbarOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [navbarOpen, isSignInOpen, isSignUpOpen])

  useEffect(() => {
    if (isSignInOpen || isSignUpOpen || navbarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isSignInOpen, isSignUpOpen, navbarOpen])

  return (
    <header
      className={`fixed top-0 z-40 py-4 w-full transition-all duration-300 ${
        sticky ? 'shadow-lg bg-white' : 'shadow-none'
      }`}>
      <div>
        <div className='container flex items-center justify-between'>
          <Logo />
          <div className='flex items-center gap-2 lg:gap-3'>
            {!user ? <button
              className='hidden lg:block  duration-300 bg-primary/15 text-primary hover:text-white hover:bg-primary font-medium text-md py-2 px-6 rounded-lg hover:cursor-pointer'
              onClick={() => {
                setIsSignInOpen(true)
              }}>
              Sign In
            </button> : <span className='hidden lg:block'><span className='text-[22px]'>👋</span> Hey {user.user_metadata.full_name.split(' ')[0]}</span>}
            {isSignInOpen && (
              <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50'>
                <div
                  ref={signInRef}
                  className='relative mx-auto w-full max-w-md overflow-hidden rounded-lg px-8 pt-14 pb-8 text-center bg-white'>
                  <button
                    onClick={() => setIsSignInOpen(false)}
                    className='absolute top-0 right-0 mr-4 mt-8 hover:cursor-pointer'
                    aria-label='Close Sign In Modal'>
                    <Icon
                      icon='material-symbols:close-rounded'
                      width={24}
                      height={24}
                      className='text-black hover:text-primary text-24 inline-block me-2'
                    />
                  </button>
                  <Signin setIsSignInOpen={setIsSignInOpen} setIsSignUpOpen={setIsSignUpOpen} />
                </div>
              </div>
            )}
            {!user ? <button
              className='hidden lg:block bg-primary duration-300 text-white hover:bg-primary/15 hover:text-primary font-medium text-md py-2 px-6 rounded-lg hover:cursor-pointer'
              onClick={() => {
                setIsSignUpOpen(true)
              }}>
              Sign Up
            </button> : <button
              className='hidden lg:block bg-primary duration-300 text-white hover:bg-primary/15 hover:text-primary font-medium text-md py-2 px-6 rounded-lg hover:cursor-pointer'
              onClick={async () => {
                let error;
                // const { error } = await supabase().auth.signOut()
                if (!error) {
                  localStorage.removeItem('mpg_email')
                  window.location.href = '/'
                }
              }}>
              Sign Out
            </button>}
            {isSignUpOpen && (
              <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50'>
                <div
                  ref={signUpRef}
                  className='relative mx-auto w-full max-w-md overflow-hidden rounded-lg bg-dark_grey/90 bg-white backdrop-blur-md px-8 pt-14 pb-8 text-center'>
                  <button
                    onClick={() => setIsSignUpOpen(false)}
                    className='absolute top-0 right-0 mr-4 mt-8 hover:cursor-pointer'
                    aria-label='Close Sign Up Modal'>
                    <Icon
                      icon='material-symbols:close-rounded'
                      width={24}
                      height={24}
                      className='text-black hover:text-primary text-24 inline-block me-2'
                    />
                  </button>
                  <SignUp setIsSignUpOpen={setIsSignUpOpen} setIsSignInOpen={setIsSignInOpen} />
                </div>
              </div>
            )}
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className='block lg:hidden p-2 rounded-lg'
              aria-label='Toggle mobile menu'>
              <span className='block w-6 h-0.5 bg-black'></span>
              <span className='block w-6 h-0.5 bg-black mt-1.5'></span>
              <span className='block w-6 h-0.5 bg-black mt-1.5'></span>
            </button>
          </div>
        </div>
        {navbarOpen && (
          <div className='fixed top-0 left-0 w-full h-full bg-black/50 z-40' />
        )}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden fixed top-0 right-0 h-full w-full bg-white shadow-lg transform transition-transform duration-300 max-w-xs ${
            navbarOpen ? 'translate-x-0' : 'translate-x-full'
          } z-50`}>
          <div className='flex items-center justify-between gap-2 p-4'>
            <div>
              <Logo />
            </div>
            {/*  */}
            <button
              onClick={() => setNavbarOpen(false)}
              className="hover:cursor-pointer"
              aria-label='Close menu Modal'>
              <Icon
                icon='material-symbols:close-rounded'
                width={24}
                height={24}
                className='text-black hover:text-primary text-24 inline-block me-2'
              />
            </button>
          </div>
          <nav className='flex flex-col items-start p-4'>
            {user ? <span className='text-center'><span className='text-[22px]'>👋</span> Hey {user.user_metadata.full_name.split(' ')[0]}</span> : <></>}
            <div className='mt-4 flex flex-col space-y-4 w-full'>
              {user ? 
              <button
                  className='bg-primary text-white px-4 py-2 rounded-lg border  border-primary hover:text-primary hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out'
                  onClick={async () => {
                    let error;
                    // const { error } = await supabase().auth.signOut()
                    if (!error) {
                      window.location.href = '/'
                    }
                  }}>
                  Sign Out
                </button>
                : <>
                <button
                  className='bg-primary text-white px-4 py-2 rounded-lg border  border-primary hover:text-primary hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out'
                  onClick={() => {
                    setIsSignInOpen(true)
                    setNavbarOpen(false)
                  }}>
                  Sign In
                </button>
                <button
                  className='bg-primary text-white px-4 py-2 rounded-lg border  border-primary hover:text-primary hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out'
                  onClick={() => {
                    setIsSignUpOpen(true)
                    setNavbarOpen(false)
                  }}>
                  Sign Up
                </button>
              </>}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
