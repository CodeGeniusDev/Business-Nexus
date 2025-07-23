import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  Send, 
  MessageCircle,
  Users,
  Search
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChatViewProps {
  selectedUserId: string | null;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ selectedUserId, onBack }) => {
  const { user, users, chatMessages, sendMessage, getChatHistory } = useAuth();
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  // Get all users the current user has chatted with
  const chatPartners = users.filter(u => {
    if (u.id === user.id) return false;
    const hasMessages = chatMessages.some(msg => 
      (msg.senderId === user.id && msg.receiverId === u.id) ||
      (msg.senderId === u.id && msg.receiverId === user.id)
    );
    return hasMessages || u.id === selectedUserId;
  });

  // Filter chat partners based on search
  const filteredPartners = chatPartners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (partner.startupName && partner.startupName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get current chat partner
  const currentPartner = selectedUserId ? users.find(u => u.id === selectedUserId) : null;
  
  // Get chat history for selected user
  const currentChatHistory = selectedUserId ? getChatHistory(user.id, selectedUserId) : [];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChatHistory]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedUserId) return;

    sendMessage(selectedUserId, message.trim());
    setMessage('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupedMessages = currentChatHistory.reduce((groups: any, message) => {
    const date = formatDate(message.timestamp);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold">Messages</h2>
            <div></div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredPartners.length > 0 ? (
              <div className="space-y-1">
                {filteredPartners.map((partner) => {
                  const lastMessage = chatMessages
                    .filter(msg => 
                      (msg.senderId === user.id && msg.receiverId === partner.id) ||
                      (msg.senderId === partner.id && msg.receiverId === user.id)
                    )
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

                  const isSelected = selectedUserId === partner.id;
                  const unreadCount = chatMessages.filter(msg => 
                    msg.senderId === partner.id && 
                    msg.receiverId === user.id
                    // In a real app, you'd track read status
                  ).length;

                  return (
                    <motion.button
                      key={partner.id}
                      onClick={() => window.location.hash = `chat-${partner.id}`}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        isSelected 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={partner.avatar} alt={partner.name} />
                          <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 truncate">
                              {partner.name}
                            </p>
                            {lastMessage && (
                              <span className="text-xs text-gray-500">
                                {formatTime(lastMessage.timestamp)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {partner.role === 'entrepreneur' ? partner.startupName : 'Investor'}
                          </p>
                          {lastMessage && (
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {lastMessage.senderId === user.id ? 'You: ' : ''}
                              {lastMessage.message}
                            </p>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <Badge className="bg-blue-600 text-white text-xs px-2 py-1">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'No conversations found' : 'No conversations yet'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Start a conversation from the dashboard
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentPartner ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentPartner.avatar} alt={currentPartner.name} />
                  <AvatarFallback>{currentPartner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{currentPartner.name}</h3>
                  <p className="text-sm text-gray-500">
                    {currentPartner.role === 'entrepreneur' 
                      ? currentPartner.startupName || 'Entrepreneur'
                      : 'Investor'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {Object.entries(groupedMessages).map(([date, messages]: [string, any]) => (
                  <div key={date}>
                    {/* Date Separator */}
                    <div className="flex items-center justify-center my-4">
                      <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                        {date}
                      </div>
                    </div>

                    {/* Messages for this date */}
                    <AnimatePresence>
                      {messages.map((msg: any, index: number) => {
                        const isOwn = msg.senderId === user.id;
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
                          >
                            <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              {!isOwn && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={currentPartner.avatar} alt={currentPartner.name} />
                                  <AvatarFallback className="text-xs">{currentPartner.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={`px-4 py-2 rounded-2xl ${
                                  isOwn
                                    ? 'bg-blue-600 text-white rounded-br-sm'
                                    : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                                }`}
                              >
                                <p className="text-sm">{msg.message}</p>
                                <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                                  {formatTime(msg.timestamp)}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message ${currentPartner.name}...`}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={!message.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatView;