'use client';
import React from 'react'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation';

export default function CloseModal() {
    const router = useRouter();
  return (
    <Button onClick={router.back} variant={'link'} className='h-6 w-6 rounded-md hover:bg-green-700/30'>
        <X className='w-4 h-4' />
    </Button>
  )
}
