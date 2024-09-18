"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

import { Button } from '@/components/ui/button'
import { handleGithubSignIn } from '@/lib/auth/githubSignInServerAction'
import { handleGoogleSignIn } from '@/lib/auth/googleSignInServerAction'


type Props = {}

export const Social = (props: Props) => {
  const { push } = useRouter();
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button size="lg" className='w-full' variant="outline"
        onClick={() => handleGoogleSignIn()}>
        <FcGoogle className='h-5 w-5' />
      </Button>
      <Button size="lg" className='w-full' variant="outline"
        onClick={() => handleGithubSignIn()}>
        <FaGithub className='h-5 w-5' />
      </Button>
    </div>
  )
}

