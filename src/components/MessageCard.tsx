"use client";

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

import { Button } from '@/components/ui/button';
import { ApiResponse } from '@/types/ApiResponse';
import toast from 'react-hot-toast';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({message,onMessageDelete}: MessageCardProps) {
  const [replyText,setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = async () => {
    if(!replyText.trim()) return;
    
    setIsReplying(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/reply-message/${message._id}`, 
        {reply: replyText }
      );
      toast.success(response.data.message);
      message.reply = replyText;
      setReplyText('');
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
         toast.error(axiosError.response?.data.message || 'Error sending reply');
    } finally {
      setIsReplying(false);
    }
  }

    const handleDeleteConfirm = async () => {
        try {
              const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast(response.data.message);

        onMessageDelete(message._id as string);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast(axiosError.response?.data.message || 'Error deleting message');
            } else {
                toast('Error deleting message');
            }
        }
    }
    return (
            <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>     
         </CardHeader>
      <CardContent>
        {message.reply ? ( 
          <div className='text-green-700'>Reply: {message.reply}</div>
        ) : (
          <div className='flex gap-2 mt-2'>
            <Textarea placeholder='Write a reply...' value={replyText} onChange={(e) => setReplyText(e.target.value)}/>
            <Button onClick={handleReply} disabled={isReplying}>
              {isReplying ? 'Replying...' : 'Reply'}

            </Button>
          </div>
        )}
      </CardContent>
    </Card>
    )

}