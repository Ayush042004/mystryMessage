'use client'
import React from 'react'
import toast from "react-hot-toast"
import { useRouter } from 'next/navigation'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form";
import * as z from "zod";
import Link from "next/link"
import { signInSchema } from '@/schemas/signInSchema'
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { signIn } from 'next-auth/react'
import Image from 'next/image'


function Page() {
      const router = useRouter();

      const form = useForm<z.infer<typeof signInSchema>>({
          resolver: zodResolver(signInSchema),
          defaultValues: {
            identifier:"",
            password:"",
          }
        });
        const onSubmit = async (data: z.infer<typeof signInSchema>) => {
          const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
          });

          if(result?.error){
            if(result.error === 'CredentialsSignin'){
              toast('Invalid credentials. Please try again.', {
                icon: '❌',
              });
            } else {
              toast('An unexpected error occurred. Please try again later.', {
                icon: '❌',
              });
            }
          }
          if(result?.url) {
            router.replace('/dashboard');
          }
        }


  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center p-4'>
        <div className='w-full max-w-md'>
         
          <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 animate-scale-in'>
            <div className='text-center mb-8'>
                <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
                  Welcome Back
                </h1>
                <p className='text-gray-600 dark:text-gray-400'>Sign in to continue your secret conversations</p>
            </div>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
               <FormField
                 control={form.control}
                 name="identifier"
                 render={({field}) => (
                    <FormItem className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <FormLabel className="text-gray-700 dark:text-gray-300">Email/Username</FormLabel>
                        <FormControl>
                            <Input 
                              {...field}
                              className="h-12 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-all duration-300"
                              placeholder="Enter your email or username"
                            /> 
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                 )}
               />

                <FormField
                 control={form.control}
                 name="password"
                 render={({field}) => (
                    <FormItem className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                        <FormControl>
                            <Input 
                              type="password" 
                              {...field}
                              className="h-12 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-all duration-300"
                              placeholder="Enter your password"
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                 )}
               />

                <Button 
                  className='w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-300 hover-lift animate-fade-in-up' 
                  type="submit"
                  style={{ animationDelay: '0.3s' }}
                >
                  Sign In
                </Button>
            </form>
         </Form>
          
      <div className="relative my-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white dark:bg-gray-800 px-4 text-gray-500 dark:text-gray-400">or</span>
        </div>
      </div>

      
      <Button
        variant="outline"
        className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover-lift animate-fade-in-up"
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        style={{ animationDelay: '0.5s' }}
      >
        <Image src="/google.svg"  alt="Google" width={20} height={20} />
        Continue with Google
      </Button>
           <div className="text-center mt-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-gray-600 dark:text-gray-400">
           Not a member yet?{' '}
            <Link href="/sign-up" className="text-black dark:text-white hover:underline font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
        </div>
        </div>
    </div>
  )
}

export default Page