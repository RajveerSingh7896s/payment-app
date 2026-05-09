"use server" ;

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnRampTransaction(amount:number,provider:string) {
    const server = await getServerSession(authOptions) ;
    const userId = server.user.id ;
    const token = Math.random().toString() ;
    if(!userId){
        return {
            message :"User not logged in"
        }
    }
    
    await prisma.onRampTransaction.create({
        data:{
            userId:Number(userId),
            amount:amount*100,
            status:"Processing",
            startTime:new Date(),
            provider,
            token
        }, 
        
    })
    return {
        message : "on ramp transaction added."
    }
}