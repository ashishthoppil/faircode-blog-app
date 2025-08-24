import { Icon } from "@iconify/react"
import Image from "next/image"
import { useRouter } from "next/navigation";

export const BlogItem = ({ isDashboard, blog, onEdit, onDelete }) => {

    const router = useRouter();

    return (
        <div onClick={() => router.push(`/posts/${blog._id}`)} className="blog-item bg-white flex flex-col gap-5 w-full border-[1px] shadow-md hover:shadow-lg hover:cursor-pointer transition duration-200 rounded-md px-5 py-5 mt-10">
            <div className='flex flex-col-reverse md:flex-row justify-between gap-5'>
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-2 justify-start items-center'>
                        <Image src={'/user.png'} height={30} width={30} alt='User' />
                        <div className="flex flex-col">
                            <span>{blog.authorName}</span>
                            <span className="text-xs text-gray-400">
                                {new Date(blog.updatedAt).toLocaleDateString("en-US", {
                                    day: "numeric", month: "long", year: "numeric",
                                })}
                            </span>
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='flex flex-col gap-2'>
                            <h1 className='text-xl font-bold'>{blog.title}</h1>
                            <h3 className='text-sm text-black/55'>{blog.content.split('.')[0]}...</h3>
                        </div>
                    </div>
                </div>
                <Image src={'/blog-img.png'} height={100} width={200} alt='Blog Image' className='w-full md:w-[200px] h-[100px] object-cover rounded-md' />
            </div>
            {isDashboard && <div className="flex gap-5 justify-end">
                <button onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                }} className="flex gap-0 items-center text-blue-600 hover:bg-blue-600 hover:text-white transition duration-300 hover:cursor-pointer text-xs border-[1px] border-blue-600 p-1 pr-2 rounded-md">
                    <Icon
                        icon='mdi:pencil'
                        width={12}
                        height={12}
                        className='text-24 inline-block me-2'
                    />
                    Edit
                </button>
                <button onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }} className="flex gap-0 items-center text-red-500 hover:bg-red-500 hover:text-white transition duration-300 hover:cursor-pointer text-xs border-[1px] border-red-500 p-1 rounded-md">
                    <Icon
                        icon='streamline:delete-1'
                        width={8}
                        height={8}
                        className='text-24 inline-block me-2'
                    />
                    Delete
                </button>
            </div>}
        </div>
    )
}