import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest,{params}:{params:{messageid: string}}){
  
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User ;

    if(!session || !user) {
        return Response.json({
            success: false, message: 'Not authenticated'
        }, {status: 401});
    }

    const messageId = params.messageid;
    const userid = user._id
    const {reply} = await request.json();

    try {
        const result = await UserModel.updateOne({
          _id: userid,
          "messages._id": messageId
        },
    {
        $set: {
            "messages.$.reply": reply
        },
    })
    if(result.modifiedCount === 0 ){
         return Response.json(
        { success: false, message: "Message not found or already replied " },
        { status: 404 }
      );
    }

      return Response.json(
      { success: true, message: "Reply saved successfully" },
      { status: 200 }
    );
        
    } catch (error) {
          console.error("Error replying to message:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
    }
}