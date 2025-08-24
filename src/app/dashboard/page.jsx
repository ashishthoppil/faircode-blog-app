'use client';

import { useRef, useState } from 'react';
import Logo from '../components/Layout/Header/Logo';
import { Icon } from '@iconify/react';
import { BlogItem } from '../components/BlogItem';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function Home() {
    
    const [navbarOpen, setNavbarOpen] = useState(true)
    const [activeSection, setActiveSection] = useState('profile')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [userPass, setUserPass] = useState('')
    const [role, setRole] = useState('')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [blogs, setBlogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [userEditingId, setUserEditingId] = useState('');
    const [loader, setLoader] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const sidebarRef = useRef(null)

    const { data: session } = useSession();

    useEffect(() => {
        const loadUser = async () => {
            const response = await fetch('/api/user/me');
            const data = await response.json();
            setRole(data.role);
            setName(data.name);
            setEmail(data.email);
            setLoader(false);
        }
        const loadPosts = async () => {
            const response = await fetch(`/api/posts?q=${searchTerm}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            setBlogs(data);
        }
        reloadUsers();
        loadUser();
        loadPosts();
    }, [])

    useEffect(() => {
        const loadPosts = async () => {
            const response = await fetch(`/api/posts?q=${searchTerm}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            console.log('datadata', data);
            setBlogs(data);
        }
        loadPosts();
    }, [searchTerm]);

    async function reloadPosts() {
        const res = await fetch('/api/posts');
        const data = await res.json();
        if (res.ok) setBlogs(data);
    }

    async function reloadUsers() {
        const res = await fetch('/api/user/me?role=admin');
        const data = await res.json();
        if (res.ok) setUsers(data);
    }

    const resetBlogForm = () => {
        setTitle('');
        setContent('');
        setEditingId(null);
    };

    const resetUserAddForm = () => {
        setUserEmail('');
        setUserName('');
        setUserPass('');
    };

    const updateHandler = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/user/update", {
            method: "PATCH",
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

    const handleUserAdd = async (e) => {
        e.preventDefault();
        if (!userName.trim() || !userEmail.trim() || (userEditingId === '' && !userPass.trim())) {
            toast.error('Fill in all required details!');
            return;
        }

        const url = userEditingId ? `/api/user/update` : '/api/user/add';
        const method = userEditingId ? 'PATCH' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userEditingId, name: userName.trim(), email: userEmail.trim(), password: userPass.trim() }),
        });

        const data = await res.json();
        if (!res.ok) return toast.error(data?.error || `Failed to ${userEditingId ? 'update' : 'create'} user`);

        toast.success(userEditingId ? 'User updated!' : 'User added!');
        resetUserAddForm();
        await reloadUsers();
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

    const onUserEdit = (user) => {
        setUserEditingId(user._id);
        setUserName(user.name);
        setUserEmail(user.email);
    };
  
    const onUserDelete = async (id) => {
        if (!confirm('Delete this user?')) return;
        const res = await fetch(`/api/user/delete?id=${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) return toast.error(data?.error || 'Failed to delete');
        toast.success('User deleted');
        resetUserAddForm();
        await reloadUsers();
    };
    
    return (
            <section id='dashboard' className='flex bg-gray-50 md:h-screen'>
                <div ref={sidebarRef}
                    className={` h-[] w-[100px] bg-white shadow-lg transform transition-transform duration-300 max-w-xs ${
                        navbarOpen ? 'translate-x-0' : 'translate-x-0'
                    } z-50`}
                >
                    <nav className='flex flex-col items-start py-4'>
                        <div className='mt-4 flex flex-col space-y-4 w-full'>
                            <button onClick={() => setActiveSection('profile')} className={`${activeSection === 'profile' ? 'bg-primary text-white hover:bg-primary/75' : ''} text-primary hover:bg-gray-200 w-full py-5 font-semibold hover:cursor-pointer`}>
                                Profile
                            </button>
                            {role === 'admin' &&
                                <button onClick={() => setActiveSection('users')} className={`${activeSection === 'users' ? 'bg-primary text-white hover:bg-primary/75' : ''} text-primary hover:bg-gray-200 w-full py-5 font-semibold hover:cursor-pointer`}>
                                    Users
                                </button>
                            }
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
                            <div className='flex flex-col md:flex-row gap-10'>
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

                {activeSection === 'users' && <div className='flex flex-col gap-10 py-14 px-8 w-full'>
                    <div className='flex flex-col gap-2'>
                        <h2>Users</h2>
                        <span className='text-xs text-gray-500'>You can create, view, edit or delete users here.</span>
                    </div>
                    <div className='flex flex-col md:flex-row gap-10'>
                        <div className='w-full md:w-[50%] md:border-r-2 md:pr-10'>
                            <form className='flex flex-col gap-10 w-full'>
                                <div className='flex flex-col gap-10'>
                                    <input
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        type='text'
                                        placeholder='Enter users name'
                                        className='w-full shadow-md bg-white rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
                                    />
                                    <input
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        type='email'
                                        placeholder='Enter users email'
                                        className='w-full shadow-md bg-white rounded-md border border-solid bg-transparent px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
                                    />
                                    <input
                                        disabled={userEditingId !== ''}
                                        value={userPass}
                                        onChange={(e) => setUserPass(e.target.value)}
                                        type='password'
                                        placeholder='Enter a unique password'
                                        className={`w-full shadow-md  rounded-md border border-solid px-5 py-3 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black ${userEditingId !== '' ? 'bg-gray-300' : 'bg-white'}`}
                                    />
                                </div>
                                <div className='flex justify-end'>
                                    <button
                                        onClick={handleUserAdd}    
                                        type='submit'
                                        className='bg-primary w-[130px] py-3 rounded-lg text-18 font-medium border text-white border-primary hover:text-primary hover:bg-transparent hover:cursor-pointer transition duration-300 ease-in-out'>
                                        <Icon
                                            icon='uil:save'
                                            width={24}
                                            height={24}
                                            className='hover:text-primary text-24 inline-block me-2'
                                        />
                                        {userEditingId ? 'Update' : 'Add User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className='w-full md:w-[50%]'>
                            <h3 className='font-semibold pb-2 border-b-2'>Users List</h3>
                            {/* Mobile (cards) */}
                            <ul className="flex flex-col gap-5 md:hidden divide-y rounded-lg border bg-white mt-5">
                                {users.map((user) => (
                                    <li key={user._id} className="p-4 flex items-start gap-3">
                                    <Image src="/user.png" height={36} width={36} alt="User" className="rounded-full" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-sm text-gray-500 truncate">{user.email}</div>
                                        <div className="mt-3 flex gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onUserEdit(user); }}
                                            className="flex items-center gap-1 text-blue-600 hover:bg-blue-600 hover:text-white transition text-xs border border-blue-600 px-2 py-1 rounded-md"
                                        >
                                            <Icon icon="mdi:pencil" width={12} height={12} />
                                            Edit
                                        </button>
                                        {user._id !== session.user.id && (
                                            <button
                                            onClick={(e) => { e.stopPropagation(); onUserDelete(user._id); }}
                                            className="flex items-center gap-1 text-red-500 hover:bg-red-500 hover:text-white transition text-xs border border-red-500 px-2 py-1 rounded-md"
                                            >
                                            <Icon icon="streamline:delete-1" width={10} height={10} />
                                            Delete
                                            </button>
                                        )}
                                        </div>
                                    </div>
                                    </li>
                                ))}
                            </ul>
                            <div className='hidden md:block h-[28rem] overflow-y-auto'>
                                <table className='w-full mt-5'>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th className='text-left'>Name</th>
                                            <th className='text-left'>Email</th>
                                            <th className='text-right'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                        <tr className='border-b hover:bg-white hover:shadow-md hover:cursor-pointer' key={user._id}>
                                            <td className='py-5'>
                                                <Image src={'/user.png'} height={30} width={30} alt='User' />
                                            </td>
                                            <td className='text-left py-5'>{user.name}</td>
                                            <td className='text-left py-5'>{user.email}</td>
                                            <td className='flex justify-end gap-2 py-5'>
                                                <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    onUserEdit(user);
                                                }} className="flex gap-0 items-center text-blue-600 hover:bg-blue-600 hover:text-white transition duration-300 hover:cursor-pointer text-xs border-[1px] border-blue-600 p-1 pr-2 rounded-md">
                                                    <Icon
                                                        icon='mdi:pencil'
                                                        width={12}
                                                        height={12}
                                                        className='text-24 inline-block me-2'
                                                    />
                                                    Edit
                                                </button>
                                                {user._id !== session.user.id && <button onClick={(e) => {
                                                    e.stopPropagation();
                                                    onUserDelete(user._id);
                                                }} className="flex gap-0 items-center text-red-500 hover:bg-red-500 hover:text-white transition duration-300 hover:cursor-pointer text-xs border-[1px] border-red-500 p-1 rounded-md">
                                                    <Icon
                                                        icon='streamline:delete-1'
                                                        width={8}
                                                        height={8}
                                                        className='text-24 inline-block me-2'
                                                    />
                                                    Delete
                                                </button>}
                                            </td>
                                        </tr>))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>}

                {activeSection === 'posts' && <div className='flex flex-col gap-10 py-14 px-8 w-full'>
                    <div className='flex flex-col gap-2'>
                        <h2>Posts</h2>
                        <span className='text-xs text-gray-500'>You can view, modify or delete your posts here.</span>
                    </div>
                    <div className='flex flex-col md:flex-row gap-10'>
                        <div className='w-full md:w-[50%] md:border-r-2 md:pr-10'>
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
                        <div className='w-full md:w-[50%]'>
                            <div className='flex flex-col md:flex-row md:items-end justify-between pb-2 border-b-2'>
                                <h3 className='font-semibold'>{role === 'admin' ? 'Posts' : 'Your Posts'}</h3>
                                {role === 'admin' && <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    type='text'
                                    placeholder='Search by Author or Post Title'
                                    className='w-full mt-5 md:mt-0 md:w-[400px] shadow-md bg-white rounded-md border border-solid bg-transparent px-5 py-1 text-base text-dark outline-hidden transition border-gray-200 placeholder:text-black/30 focus:border-primary focus-visible:shadow-none text-black'
                                />}
                            </div>
                            
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
