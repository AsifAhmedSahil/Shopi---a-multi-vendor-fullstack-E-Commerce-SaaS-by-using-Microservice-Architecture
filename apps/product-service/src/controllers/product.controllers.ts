import prisma from "@packages/lib/prisma";
import { NextFunction, Request, Response } from "express";


export const getCategories = async(
    req:Request,res:Response,next:NextFunction
) =>{

    try {
        const config = await prisma.site_config.findFirst()
        if(!config){
            return res.status(404).json({message:"Categories not found"});
        }

        return res.status(200).json({
            categories: config.categories,
            subCategories: config.subCategories
        })
    } catch (error) {
        console.log(error )
        
    }
}