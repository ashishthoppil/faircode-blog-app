import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link href='/' className='flex items-center'>
      <Icon
        icon='logos:blogger'
        width={24}
        height={24}
        className='text-black hover:text-primary text-24 inline-block me-2'
      />
      <p className='text-black text-2xl font-semibold'>Blog</p>
    </Link>
  )
}

export default Logo
