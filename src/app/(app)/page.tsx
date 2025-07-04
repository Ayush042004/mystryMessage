"use client";

import Image from "next/image";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, MessageCircle, Shield, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
 
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gradient-to-br from-gray-500 via-white to-gray-800 dark:from-gray-900 dark:via-black dark:to-gray-800 min-h-screen">
        <section className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium mb-6 animate-scale-in border-4 border-gray-400">
              <Shield className="w-4 h-4 mr-2" />
              100% Anonymous & Secure
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-6 leading-tight">
            Dive into the World of
            <span className="block gradient-text">Anonymous Feedback</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            True Feedback - Where your identity remains a secret and honest conversations flourish.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="group bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl transition-all duration-300 hover-lift">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="lg" className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

    
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover-lift">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-700 dark:text-gray-300" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Anonymous Messages</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Send and receive messages without revealing your identity</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover-lift">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-700 dark:text-gray-300" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Secure & Private</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Your privacy is our priority with end-to-end protection</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover-lift">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-700 dark:text-gray-300" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Community Driven</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Join thousands of users sharing honest feedback</p>
            </div>
          </div>
        </section>

        
        <section className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              See What Others Are Saying
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Real messages from our community
            </p>
          </div>
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full max-w-lg md:max-w-2xl mx-auto"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="hover-lift transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-gray-900 dark:text-white">{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-3 md:space-y-0 md:space-x-4">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <Mail className="flex-shrink-0 w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 dark:text-gray-300 mb-2">{message.content}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </section>
      </main>


      <footer className="bg-gray-900 dark:bg-black text-white border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">True Feedback</h3>
            <p className="text-gray-400 mb-4">Where honest conversations begin</p>
            <p className="text-sm text-gray-500">
              © 2025 True Feedback. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}