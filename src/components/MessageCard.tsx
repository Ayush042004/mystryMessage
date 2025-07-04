"use client";

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { X, Reply, Calendar, MessageSquare } from 'lucide-react';
import { Message } from '@/model/User';
import dayjs from 'dayjs';
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
      toast.success(response.data.message);

        onMessageDelete(message._id as string);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast.error(axiosError.response?.data.message || 'Error deleting message');
            } else {
                toast.error('Error deleting message');
            }
        }
    }
    return (
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover-lift transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Anonymous Message</span>
              </div>
              <CardTitle className="text-gray-900 dark:text-white leading-relaxed">
                {message.content}
              </CardTitle>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant='destructive' 
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-gray-900 dark:text-white">
                    Delete Message
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                    This action cannot be undone. This will permanently delete this message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-lg">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteConfirm}
                    className="bg-red-600 hover:bg-red-700 rounded-lg"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>  
          <div className='flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400'>
            <Calendar className="w-4 h-4" />
            {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}  
          </div>   
        </CardHeader>
        <CardContent>
          {message.reply ? ( 
            <div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border-l-4 border-green-500'>
              <div className="flex items-center gap-2 mb-2">
                <Reply className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Your Reply</span>
              </div>
              <p className='text-green-800 dark:text-green-200'>{message.reply}</p>
            </div>
          ) : (
            <div className='space-y-3'>
              <Textarea 
                placeholder='Write a thoughtful reply...' 
                value={replyText} 
                onChange={(e) => setReplyText(e.target.value)}
                className="bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-all duration-300 resize-none"
                rows={3}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleReply} 
                  disabled={isReplying || !replyText.trim()}
                  className="h-10 px-6 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-300 flex items-center gap-2"
                >
                  {isReplying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Replying...
                    </>
                  ) : (
                    <>
                      <Reply className="w-4 h-4" />
                      Reply
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
}