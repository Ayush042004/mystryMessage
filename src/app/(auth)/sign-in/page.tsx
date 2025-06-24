'use client'
import React, { useState } from 'react'
import {useDebounceValue} from "usehooks-ts"
import toast from "react-hot-toast"
import { useRouter } from 'next/navigation'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form";
import * as z from "zod";
import Link from "next/link"
import { signInSchema } from '@/schemas/signInSchema'

function page() {
  const [username,setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting,setIsSubmitting] = useState(false);

  const debouncedUsername = useDebounceValue(username,300)
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    
  })

  return (

    <div>page</div>
  )
}

export default page