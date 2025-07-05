import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextRequest } from "next/server";



export async function GET(request:NextRequest, { params }: { params: Promise<{ username: string }> }) {
    await dbConnect();
    const {username} =  await params;

    try {
        const user = await UserModel.findOne({username}).select("messages").lean()
        if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const RepliedMessages = user.messages.filter((message) => message.reply);

    return Response.json({
        success: true,
        messages: RepliedMessages,
    })
    } catch (error) {
        return Response.json({ success: false, message: error }, { status: 500 });
    }
}