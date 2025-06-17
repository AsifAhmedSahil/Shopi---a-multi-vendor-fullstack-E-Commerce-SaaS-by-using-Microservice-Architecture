import { AuthenticationError } from "@packages/error-handler";
import { NextFunction, Response } from "express";

export const isSeller = (req:any,res:Response,next:NextFunction) =>{
    if(req.role !== "seller"){
        return next(new AuthenticationError("Access Denined: Seller Only"))
    }

    

}
export const isUser = (req:any,res:Response,next:NextFunction) =>{
    if(req.role !== "user"){
        return next(new AuthenticationError("Access Denined: user Only"))
    }



}