import HiveChatroom from '@/components/HiveChatRoom';
import HiveModel, { Hive } from '@/models/Hives.model';
import { TriangleAlertIcon } from 'lucide-react';
import React from 'react'

const Page = async({params}:{params: Promise<{name: string}>}) => {
  const {name} = await params;
  const hive = await HiveModel.findOne<Hive>({name});
  if(!hive) {
    return <div className='flex flex-col items-center justify-center'>
      <TriangleAlertIcon className='size-14 text-green-500 animate-pulse' />
      <h1 className='text-xl text-gray-800 font-semibold'>Hive not found</h1>
    </div>
  }
  return (
    <HiveChatroom hive={JSON.parse(JSON.stringify(hive))} />
  )
}

export default Page