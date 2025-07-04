'use client'
import React, { useEffect, useState } from 'react'
import {useDebounceCallback} from "usehooks-ts"
import toast from "react-hot-toast"
import { useRouter } from 'next/navigation'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form";
import * as z from "zod";
import Link from "next/link"
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, {AxiosError} from "axios";
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'


function page() {
      const [username,setUsername] = useState("")
      const [usernameMessage, setUsernameMessage] = useState("");
      const [isCheckingUsername, setIsCheckingUsername] = useState(false);
      const [isSubmitting,setIsSubmitting] = useState(false);
      
      const debounced = useDebounceCallback(setUsername,300)
      const router = useRouter();

      const form = useForm<z.infer<typeof signUpSchema>>({
          resolver: zodResolver(signUpSchema),
          defaultValues: {
            username: "",
            email:"",
            password:"",
          }
        })

        useEffect(() => {
            const checkUsernameUnique = async() => {
                if(username) {
                    setIsCheckingUsername(true);
                    setUsernameMessage("")

                    try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`)
                    console.log(response);
                    setUsernameMessage(response.data.message)
                    } catch (error) {
                      const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
                    } finally {
                        setIsCheckingUsername(false);
                    }
                }
            }
            checkUsernameUnique();

        },[username]);
      
        const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
            setIsSubmitting(true);

            try {
               const response = await axios.post<ApiResponse>('/api/sign-up',data);
               console.log(response);
              toast(response.data.message);

              router.replace(`/verify/${username}`)
            } catch (error) {
                console.error('Error during sign-up:', error);
                 const axiosError = error as AxiosError<ApiResponse>;

                 let errorMessage = axiosError.response?.data.message;
               
                toast(errorMessage ?? 'There was a problem with your sign-up. Please try again.');
            } finally {
                setIsSubmitting(false);
            }

        }
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 flex items-center justify-center p-4'>
        <div className='w-full max-w-md'>
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 animate-scale-in'>
            <div className='text-center mb-8'>
                <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
                  Join True Feedback
                </h1>
                <p className='text-gray-600 dark:text-gray-400'>Sign up to start your anonymous adventure</p>
            </div>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
               <FormField
                 control={form.control}
                 name="username"
                 render={({field}) => (
                    <FormItem className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <FormLabel className="text-gray-700 dark:text-gray-300">Username</FormLabel>
                        <FormControl>
                            <Input 
                              placeholder='Choose a unique username' 
                              {...field}
                              onChange={(e)=>{
                                field.onChange(e)
                                debounced(e.target.value);
                              }}
                              className="h-12 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-all duration-300"
                            /> 
                        </FormControl>
                        <div className="flex items-center space-x-2 mt-2">
                          {isCheckingUsername && (
                            <Loader2 className="animate-spin w-4 h-4 text-gray-500" />
                          )}
                          {!isCheckingUsername && usernameMessage && (
                            <>
                              {usernameMessage === 'Username is unique' ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              <p
                                className={`text-sm ${
                                  usernameMessage === 'Username is unique'
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}
                              >
                                {usernameMessage}
                              </p>
                            </>
                          )}
                        </div>
                        <FormMessage/>
                    </FormItem>
                 )}
               />

                <FormField
                 control={form.control}
                 name="email"
                 render={({field}) => (
                    <FormItem className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
                        <FormControl>
                            <Input 
                              placeholder='Enter your email address' 
                              {...field}
                              className="h-12 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-all duration-300"
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
                    <FormItem className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                        <FormControl>
                            <Input 
                              type="password" 
                              placeholder='Create a secure password' 
                              {...field}
                              className="h-12 bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 transition-all duration-300"
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                 )}
               />
                 <Button 
                   type="submit" 
                   className='w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-300 hover-lift animate-fade-in-up' 
                   disabled={isSubmitting}
                   style={{ animationDelay: '0.4s' }}
                 >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
            </form>
         </Form>
           <div className="text-center mt-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <p className="text-gray-600 dark:text-gray-400">
            Already a member?{' '}
            <Link href="/sign-in" className="text-black dark:text-white hover:underline font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
        </div>
        </div>
    </div>
  )
}

export default page