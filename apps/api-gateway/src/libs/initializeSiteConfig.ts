import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient()

export const initializeSiteConfig = async()=>{
    try {
        const existingConfig = await prisma.site_config.findFirst()
        if(!existingConfig){
            await prisma.site_config.create({
                data:{
                    categories:[
                        "Electronics",
                        "Fashion",
                        "Home & Kitchen",
                        "Sports & Fitness"
                    ],
                    subCategories:{
                    "Electronics":["Mobiles","Laptop","Accessories","Gaming"],
                    "Fashion":["Men","Women","Kids","Footwear"],
                    "Home & Kitchen":["furniture","Appliances","Decor"],
                    "Sports & Fitness":[
                        "Gym","Outdoor Sports","Wearables"
                    ]
                    }
                }
            })
        }
    } catch (error) {
        console.log("Error from initialize site config",error)

        
    }
    
}

