"use client"
import { Button } from '@/components/custom/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function NotFoundError() {
  const navigate = useRouter()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] font-bold leading-tight'>404</h1>
        <span className='font-medium'>Oops! Page Not Found!</span>
        <Image src="/logo_eneo.png" alt="logo" height={200} width={200} />
        <p className='text-center text-muted-foreground'>
          It seems like the page you{"'"}re looking for <br />
          does not exist or might have been removed.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => navigate.back()}>
            Go Back
          </Button>
          <Button onClick={() => navigate.push('/')}>Back to Home</Button>
        </div>

      </div>
    </div>
  )
}
