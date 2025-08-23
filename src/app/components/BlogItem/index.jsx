import Image from "next/image"

export const BlogItem = () => {
    return (
        <div className='blog-item bg-white flex flex-col-reverse md:flex-row justify-between gap-5 w-full border-[1px] shadow-md hover:shadow-lg hover:cursor-pointer transition duration-200 rounded-md px-5 py-5 mt-10'>
            <div className='flex flex-col gap-2'>
                <div className='flex gap-2 justify-start items-center'>
                    <Image src={'/user.png'} height={25} width={25} alt='User' />
                    <span>Ashish Thoppil</span>
                </div>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-2'>
                        <h1 className='text-xl font-bold'>Don't use React imports like this. Use Wrapper Pattern instead.</h1>
                        <h3 className='text-sm text-black/55'>While working on a real-life project, I encountered an inefficient React.js import strategy. Learn how to import the right way!</h3>
                    </div>
                </div>
            </div>
            <Image src={'/blog-img.png'} height={100} width={200} alt='Blog Image' className='w-full md:w-[200px] h-[100px] object-cover rounded-md' />
        </div>
    )
}