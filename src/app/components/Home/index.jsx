'use client'
import Image from 'next/image'
import Link from 'next/link'
import { BlogItem } from '../BlogItem'
import { useEffect, useState } from 'react'

const Hero = () => {

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      const response = await fetch('/api/posts', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setBlogs(data);
    }
    loadPosts();
  }, [])

  return (
    <section id='home-section' className='flex items-center bg-gray-50 h-screen'>
      <div className='container xl:pt-7 pt-16'>
        <div className='grid grid-cols-1 lg:grid-cols-12 items-center'>
          <div className='lg:col-span-6'>
            <h1 className='font-semibold mb-5 text-black lg:text-start text-center sm:leading-20 leading-16'>
              Discover, Read & Share 🧡
            </h1>
            <p className='text-black/55 text-lg font-normal mb-10 lg:text-start text-center'>
              Join a community of writers and readers and connect with<br/>
              <span><span className='font-semibold text-[#DF6853] text-2xl'>people who care </span> about the <span className='font-semibold text-[#DF6853] text-2xl'>topics you love.</span></span>
            </p>
            <div className='flex flex-col sm:flex-row gap-5 items-center justify-center lg:justify-start'>
              <Link href='/#'>
                <button id='hero_button' className='text-md font-medium rounded-lg text-white py-3 px-8 bg-primary hover:text-primary border border-primary hover:bg-transparent hover:cursor-pointer transition ease-in-out duration-300'>
                  👉 Start Blogging
                </button>
              </Link>
            </div>
          </div>

          <div className='lg:col-span-6 flex flex-col items-center justify-start relative pt-[5rem] pl-0 md:py-4 md:pl-10 h-[35rem]'>
            <span className='text-black'>Check out our top blog posts 👇</span>
            <div className='flex flex-col w-full h-[32rem] overflow-y-auto'>
              {blogs.map((blog) => 
                <BlogItem 
                  key={blog._id}
                  isDashboard={false}
                  blog={blog}
                />
              )}
            </div>
          </div>
          {/* Blogs */}
        </div>
      </div>
    </section>
  )
}

export default Hero
