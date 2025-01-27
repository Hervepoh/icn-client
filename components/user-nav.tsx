import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { useUserStore } from '@/features/users/hooks/use-user-store';
import { useAuthLogout } from '@/features/users/api/use-auth-logout';
import { useAuthMe } from '@/features/users/api/use-auth-me';
import { useState } from 'react';
import Link from 'next/link';


export function UserNav() {

  const router = useRouter();
  const { user, setUser, clearUser } = useUserStore();

  const [update, setUpdate] = useState(false);

  const mutation = useAuthLogout();

  const handleContentChange = () => {
    mutation.mutate(undefined, {
      onSuccess: () => {
        clearUser();
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        toast.success('Logout Successfully')
        setUpdate(prev => !prev); // Force un re-rendu
        router.push("/login")
      },
    });
  };

  if (!user) {
    return <Loader2 className='size-6 text-slate-300 animate-spin' />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src={user?.avatar ?? "/avatar.png"} alt='@avatar' />
            <AvatarFallback>EN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user.name}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Role : {user.role.name}
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          {user?.role?.name.toUpperCase() === 'ADMIN' &&
            <Link href={"/admin"}><DropdownMenuItem>
              adminsitration
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem></Link>}
          {/* <DropdownMenuItem>New Team</DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleContentChange()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


function removeCookie(arg0: string, arg1: { path: string; domain: string; }) {
  throw new Error('Function not implemented.');
}
