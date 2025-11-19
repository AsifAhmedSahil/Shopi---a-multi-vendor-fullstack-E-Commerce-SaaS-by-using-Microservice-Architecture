import Image from 'next/image'
import React from 'react'

interface ShopCardProps {
    shop: {
        id:string,
        name:string,
        description?:string,
        avatar:string,
        coverBanner?:string,
        address?:string,
        followers?:[],
        rating?:number,
        category?:string,
    }
}

const ShopCard : React.FC<ShopCardProps> = ({shop}) => {
  return (
    <div className='w-full rounded-md cursor-pointer bg-white border border-gray-200 transition'>
        {/* cover */}
        <div className='h-[120px] w-full relative'>
            <Image
            src={shop?.coverBanner || "https://res.cloudinary.com/djbpo9xg5/image/upload/v1725030217/qnheigwgqbwldduangmo.jpg"}
            alt='cover'
            fill
            className='object-cover w-full h-full'
            />

        </div>

    </div>
  )
}

export default ShopCard