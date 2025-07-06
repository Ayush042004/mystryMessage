"use client";

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message, User } from "@/model/User";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import {
  Loader2,
  RefreshCcw,
  Copy,
  MessageSquare,
  Settings,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(
        axiosError.response?.data.message ||
          "An error occurred while fetching message acceptance status"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh === true) {
          toast.success("Messages refreshed successfully");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const errMsg = axiosError.response?.data.message;
        if (axiosError.response?.status !== 404 || errMsg !== "User not found") {
          toast(errMsg || "An error occurred while fetching messages");
        }
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast(axiosError.response?.data.message || "An error occurred");
    }
  };

  if (!session || !session.user) return <div></div>;

  const { username } = session.user as User;

  const baseUrl = `${typeof window !== "undefined" ? window.location.protocol : "https:"}//${typeof window !== "undefined" ? window.location.host : ""}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("URL Copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-black dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your anonymous messages and settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
          <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover-lift">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {messages.length}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Total Messages
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover-lift">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {acceptMessages ? "On" : "Off"}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Accepting Messages
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover-lift">
            <div className="flex items-center">
              <Copy className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  @{username}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Your Username
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Link Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 mb-8 animate-fade-in-up">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Share Your Link
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="flex-1 h-12 px-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 focus:outline-none w-full"
            />
            <Button
              onClick={copyToClipboard}
              className="h-12 px-6 bg-black hover:bg-gray-800 text-white rounded-xl transition-all duration-300 hover-lift w-full sm:w-auto"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 mb-8 animate-fade-in-up">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Message Settings
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-gray-900 dark:text-white font-medium">
                Accept Anonymous Messages
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Allow others to send you anonymous messages
              </p>
            </div>
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-black"
            />
          </div>
        </div>

        <Separator className="my-8" />

        {/* Messages */}
        <div className="animate-fade-in-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Messages
            </h2>
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
              className="flex items-center gap-2 h-10 px-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={message._id as string}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <MessageCard
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No messages yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  Share your link to start receiving anonymous messages!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
