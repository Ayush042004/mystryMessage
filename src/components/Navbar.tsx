"use client";
 
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { LogOut, User as UserIcon } from 'lucide-react';


function Navbar() {
    const {data:session} = useSession();
    const user : User = session?.user as User;

    return(
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
            <div className="container mx-auto px-4 md:px-6 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        True Feedback
                    </Link>
                    
                    {session ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {user.username || user.email}
                                </span>
                            </div>
                            <Button 
                                onClick={() => signOut()} 
                                variant="outline"
                                className="flex items-center gap-2 h-10 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Link href="/sign-in">
                            <Button 
                                variant="outline"
                                className="h-10 px-6 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                            >
                                Sign In
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar;