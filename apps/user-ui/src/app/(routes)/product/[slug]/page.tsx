import axiosInstance from 'apps/user-ui/src/utils/axiosInstance'
import { Metadata } from 'next'
import React from 'react'

async function fetchProductDetails(slug:string) {
    const response = await axiosInstance.get(`/product/api/get-product/${slug}`)

    return response.data?.product

}

export async function generateMetaData({params}:{params:{slug:string}}): Promise<Metadata> {
    const product = await fetchProductDetails(params?.slug)

    return {
        title: `${product?.title} | Shopi marketplace`,
        description: product?.short_description || "Discover high-quality products on Shopi Marketplace",
        openGraph:{
            title:product?.title,
            description:product?.short_description || "",
            images:[product?.images?.[0]?.url || "/default-image.jpg"],
            type:"website"
        },
        twitter:{
            card:"summary_large_image",
            title:product?.title,
            description: product?.short_description || "",
            images: [product?.images?.[0]?.url || "/default-image.jpg"]
        }
    }
    
}

const Page = async({params}:{params:{slug:string}}) => {
    const productDetails = await fetchProductDetails(params?.slug)
  return (
    <div>
      
    </div>
  )
}

export default Page
