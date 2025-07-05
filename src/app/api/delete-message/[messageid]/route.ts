import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function DELETE(request:NextRequest , { params }: { params: Promise<{ messageid: string }> }){

    await dbConnect();
    const {messageid} = await params;
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    
    if(!session || !user ){
        return Response.json({
            success: false, message: 'Not authenticated'
        },{status:401})
    }

    try {
        const messageObjectId = new mongoose.Types.ObjectId(messageid);
    const updateResult = await UserModel.updateOne(
  { _id: user._id },
  { $pull: { messages: { _id: messageObjectId } } }
);

        if(updateResult.modifiedCount === 0) {
          return Response.json({
            message: "Message not found or already deleted", success: false
          },{status: 404})
        }

            return Response.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
        
    } catch (error) {
           console.error('Error deleting message:', error);
             return Response.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
    }
}