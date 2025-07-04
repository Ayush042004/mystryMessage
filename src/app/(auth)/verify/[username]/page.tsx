"use client";
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';


function VerifyAccount() {
    const router = useRouter();
    const params = useParams<{username: string}>();
    const form = useForm<z.infer<typeof verifySchema>>({
      resolver: zodResolver(verifySchema),
    });

    const onSubmit = async(data: z.infer<typeof verifySchema>) => {
      try {
        const response = await axios.post<ApiResponse>(`/api/verify-code`,{
            username: params.username,
            code: data.code,
        });
        toast(response.data.message)
        router.replace('/sign-in');
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
        toast(axiosError.response?.data.message ?? 'An error occurred. Please try again.')
      }
    }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
   
        <Link href="/sign-up" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Sign Up
        </Link>
        
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 animate-scale-in">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-gray-600 dark:text-gray-300" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Verify Your Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              We've sent a verification code to your email
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Please check your inbox and enter the 6-digit code below
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="animate-fade-in-up">
                    <FormLabel className="text-gray-700 dark:text-gray-300">Verification Code</FormLabel>
                    <Input 
                      {...field} 
                      placeholder="Enter 6-digit code"
                      className="h-12 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-all duration-300 text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-300 hover-lift animate-fade-in-up"
                style={{ animationDelay: '0.1s' }}
              >
                Verify Account
              </Button>
            </form>
          </Form>
          
          <div className="text-center mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Didn't receive the code?{' '}
              <button className="text-black dark:text-white hover:underline font-medium transition-colors">
                Resend Code
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyAccount