'use client';

import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { Message } from '@/model/User';

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');
  const [isLoading, setIsLoading] = useState(false);
  const [repliedMessages, setRepliedMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast.success(response.data.message);
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message ?? 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    setSuggestError(null);
    try {
      const response = await axios.post('/api/suggest-messages');
      const text = response.data || response;
      const parsed = text.split('||').map((q: string) => q.trim());
      setSuggestions(parsed);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestError('Failed to get suggested messages.');
      toast.error('Error fetching suggestions');
    } finally {
      setIsSuggestLoading(false);
    }
  };

  useEffect(() => {
    const fetchRepliedMessages = async () => {
      try {
        const response = await axios.get<ApiResponse>(`/api/get-reply/${username}`);
        setRepliedMessages(response.data.messages || []);
      } catch (error) {
        console.error('Error loading replies', error);
        toast("Error loading replies or replies already loaded ")
      }
    };

    if (username) fetchRepliedMessages();
  }, [username]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="w-full max-w-4xl px-4 sm:px-6 py-12 mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Send Anonymous Message
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            to <span className="font-semibold text-black dark:text-white">@{username}</span>
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Your identity will remain completely anonymous
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 mb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold text-gray-900 dark:text-white">
                      Your Anonymous Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here... Be kind and respectful!"
                        className="w-full min-h-32 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-all duration-300 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-between items-center mt-2">
                      <FormMessage />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {messageContent?.length || 0}/300
                      </span>
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isLoading || !messageContent?.trim()}
                  className="w-full sm:w-auto h-12 px-6 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Suggestions Box */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                Need Inspiration?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Tap on a suggestion to use it as your message.
              </p>
            </div>
            <Button
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              variant="outline"
              className="flex items-center gap-2 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
            >
              {isSuggestLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Get Suggestions
            </Button>
          </div>

          {suggestError ? (
            <p className="text-red-500 dark:text-red-400 text-center py-4">{suggestError}</p>
          ) : suggestions.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {suggestions.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleMessageClick(message)}
                  className="w-full h-auto p-4 text-left justify-start rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 break-words"
                >
                  <div className="flex items-start gap-3 w-full">
                    <MessageCircle className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words">
                      {message}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                Click &quot;Get Suggestions&quot; to see message ideas
              </p>
            </div>
          )}
        </div>

        <Separator className="my-8" />

        {repliedMessages.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Public Replies from @{username}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {repliedMessages.map((message, _) => (
                <Card
                  key={(message as { _id: string })._id}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover-lift"
                >
                  <CardHeader className="pb-3">
                    <div className="text-gray-700 dark:text-gray-300 font-medium break-words">
                      &quot;{message.content}&quot;
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border-l-4 border-green-500">
                      <p className="text-green-800 dark:text-green-300 font-medium break-words">
                        💬 {message.reply}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-12" />

        <div className="text-center bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-6 sm:p-8 rounded-2xl">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Want Your Own Message Board?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your account and start receiving anonymous messages from your friends!
          </p>
          <Link href="/sign-up">
            <Button className="h-12 px-8 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto">
              Create Your Account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
