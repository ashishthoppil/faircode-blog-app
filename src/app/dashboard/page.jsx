'use client';

import { useRef, useState } from 'react';
import Logo from '../components/Layout/Header/Logo';
import { Icon } from '@iconify/react';
import { BlogItem } from '../components/BlogItem';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function Home() {
    
    const [navbarOpen, setNavbarOpen] = useState(true)
    const [activeSection, setActiveSection] = useState('profile')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [blogs, setBlogs] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loader, setLoader] = useState(true);
    const sidebarRef = useRef(null)

    // const { data: session } = useSession();

    useEffect(() => {
        const loadUser = async () => {
            const response = await fetch('/api/user/me');
            const data = await response.json();
            setLoader(false);
            setName(data.name);
            setEmail(data.email);
        }
        const loadPosts = async () => {
            const response = await fetch('/api/posts', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            setBlogs(data);
        }
        loadUser();
        loadPosts();
    }, [])

    async function reloadPosts() {
        const res = await fetch('/api/posts');
        const data = await res.json();
        if (res.ok) setBlogs(data);
    }

    const resetBlogForm = () => {
        setTitle('');
        setContent('');
        setEditingId(null);
    };

    const updateHandler = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/user/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email }),
        });

        const data = await res.json();
        if (!res.ok) {
            toast.error("Failed to update")
            return;
        }
        toast.success("Updated Successfully!")
        return data;
    }

    const handleSubmitPost = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            toast.error('Title and content are required');
            return;
        }

        const url = editingId ? `/api/posts/${editingId}` : '/api/posts';
        const method = editingId ? 'PATCH' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title.trim(), content: content.trim() }),
        });

        const data = await res.json();
        if (!res.ok) return toast.error(data?.error || `Failed to ${editingId ? 'update' : 'create'} post`);

        toast.success(editingId ? 'Post updated!' : 'Post added!');
        resetBlogForm();
        await reloadPosts();
    };

    const handleEdit = (post) => {
        setEditingId(post._id);
        setTitle(post.title);
        setContent(post.content);
    };
  
    const handleDelete = async (id) => {
        if (!confirm('Delete this post?')) return;
        const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) return toast.error(data?.error || 'Failed to delete');
        toast.success('Post deleted');
        if (editingId === id) resetBlogForm();
        await reloadPosts();
    };
    
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
                    {loader ? 
                        <div className='flex justify-center items-center h-screen'>
                            <Icon
                                icon='codex:loader'
                                width={50}
                                height={50}
                                className='text-primary text-24 inline-block me-2'
                            />
                        </div>
                        
                    : <>
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
                                    className='w-full shadow-md bg-white rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
                                />
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type='email'
                                    placeholder='Enter your email id'
                                    className='w-full shadow-md bg-white rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
                                />
                            </div>
                            <div className='flex justify-end'>
                                <button
                                    onClick={updateHandler}    
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
                    </>}
                </div>}

                {activeSection === 'posts' && <div className='flex flex-col gap-10 py-14 px-8 w-full'>
                    <div className='flex flex-col gap-2'>
                        <h2>Posts</h2>
                        <span className='text-xs text-gray-500'>You can view, modify or delete your posts here.</span>
                    </div>
                    <div className='flex gap-10'>
                        <div className='w-[50%] border-r-2 pr-10'>
                            <form className='flex flex-col gap-10 w-full'>
                                <div className='flex flex-col gap-10'>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        type='text'
                                        placeholder='Enter the post title'
                                        className='w-full shadow-md bg-white rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
                                    />
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        type='email'
                                        placeholder='Enter your posts content'
                                        className='w-full shadow-md bg-white rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
                                    />
                                </div>
                                <div className='flex justify-end'>
                                    <button
                                        onClick={handleSubmitPost}    
                                        type='submit'
                                        className='bg-primary w-[130px] py-3 rounded-lg text-18 font-medium border text-white border-primary hover:text-primary hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out'>
                                        <Icon
                                            icon='uil:save'
                                            width={24}
                                            height={24}
                                            className='hover:text-primary text-24 inline-block me-2'
                                        />
                                        {editingId ? 'Update' : 'Add Post'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className='w-[50%]'>
                            <h3 className='font-semibold pb-2 border-b-2'>Your Posts</h3>
                            <div className='h-[28rem] overflow-y-auto'>
                                {blogs.map((blog) => 
                                    <BlogItem 
                                        key={blog._id}
                                        isDashboard={true}
                                        blog={blog}
                                        onEdit={() => handleEdit(blog)}
                                        onDelete={() => handleDelete(blog._id)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>}
        </section>
    );
}
