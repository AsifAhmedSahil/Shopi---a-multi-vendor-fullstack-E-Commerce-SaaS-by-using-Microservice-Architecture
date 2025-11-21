'use client'
import useUSer from 'apps/user-ui/src/hooks/useHook'
import { Loader2 } from 'lucide-react'
import React from 'react'

const page = () => {
    const {user,isLoading} = useUSer()
    console.log(user)
  return (
    <div className='bg-gray-50 p-6 pb-14'>
        <div className='max-w-7xl mx-auto'>
            {/* greatting */}
            <div className='text-center mb-10'>
                <h1 className='text-3xl font-bold text-gray-800'>
                    Welcome Back, 

                </h1> 
                <span className='text-blue-600'>
                    {
                        isLoading ? (
                            <Loader2 className='inline animate-spin w-5 h-5'/>

                        ) : (
                            `${user?.name} || "user`
                        )
                    }

                </span>

            </div>

        </div>
      
    </div>
  )
}

export default page
