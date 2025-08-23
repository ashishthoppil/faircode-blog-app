'use client';

import { useRef, useState } from 'react';
import Logo from '../components/Layout/Header/Logo';
import { Icon } from '@iconify/react';
import { BlogItem } from '../components/BlogItem';

export default function Home() {
    
    const [navbarOpen, setNavbarOpen] = useState(true)
    const [activeSection, setActiveSection] = useState('profile')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const sidebarRef = useRef(null)
    
  return (
    <section id='dashboard' className='flex bg-gray-50 h-screen'>
            <div ref={sidebarRef}
                className={` h-[] w-[100px] bg-white shadow-lg transform transition-transform duration-300 max-w-xs ${
                    navbarOpen ? 'translate-x-0' : 'translate-x-0'
                } z-50`}
            >
                <div className='flex items-center justify-between gap-2 p-4'>
                    {/* <Logo /> */}
                    <button
                        onClick={() => setNavbarOpen(false)}
                        className="md:hidden bg-white relative right-0"
                        aria-label='Close menu Modal'
                    >
                        <Icon
                            icon='icon-park-solid:left-c'
                            width={24}
                            height={24}
                            className='text-black hover:text-primary text-24 inline-block me-2'
                        />
                    </button>
                </div>
                <nav className='flex flex-col items-start py-4'>
                    <div className='mt-4 flex flex-col space-y-4 w-full'>
                        <button onClick={() => setActiveSection('profile')} className={`${activeSection === 'profile' ? 'bg-primary text-white hover:bg-primary/75' : ''} text-primary hover:bg-gray-200 w-full py-5 font-semibold hover:cursor-pointer`}>
                            Profile
                        </button>
                        <button onClick={() => setActiveSection('posts')} className={`${activeSection === 'posts' ? 'bg-primary text-white hover:bg-primary/75' : ''} text-primary hover:bg-gray-200 w-full py-5 font-semibold hover:cursor-pointer `}>
                            Posts
                        </button>
                    </div>
                </nav>
            </div>

            {activeSection === 'profile' && <div className='flex flex-col gap-10 py-14 px-8 w-full'>
                <div className='flex flex-col gap-2'>
                    <h2>Profile</h2>
                    <span className='text-xs text-gray-500'>You can modify your name, password and email from here.</span>
                </div>
                <form className='flex flex-col gap-10 w-full'>
                    <div className='flex gap-10'>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type='text'
                            placeholder='Enter your name'
                            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
                        />
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                            placeholder='Enter your email id'
                            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
                        />
                    </div>
                    <div className='flex gap-2'>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type='password'
                            placeholder='Enter your password'
                            className='w-full rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
                        />
                    </div>
                    <div className='flex justify-end'>
                        <button    
                            type='submit'
                            className='bg-primary w-[100px] py-3 rounded-lg text-18 font-medium border text-white border-primary hover:text-primary hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out'>
                            <Icon
                                icon='uil:save'
                                width={24}
                                height={24}
                                className='hover:text-primary text-24 inline-block me-2'
                            />
                            Save
                        </button>
                    </div>
                </form>
            </div>}

            {activeSection === 'posts' && <div className='flex flex-col gap-10 py-14 px-8 w-full'>
                <div className='flex flex-col gap-2'>
                    <h2>Posts</h2>
                    <span className='text-xs text-gray-500'>You can view, modify or delete your posts here.</span>
                </div>
                <BlogItem />
            </div>}
    </section>
  );
}
