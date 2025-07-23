import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  Users, 
  MessageCircle, 
  User, 
  LogOut, 
  Menu,
  X,
  Bell
} from 'lucide-react';
import InvestorDashboard from './InvestorDashboard';
import EntrepreneurDashboard from './EntrepreneurDashboard';
import ProfileView from './ProfileView';
import ChatView from './ChatView';
import { Badge } from '@/components/ui/badge';

type DashboardView = 'dashboard' | 'profile' | 'chat';

const Dashboard: React.FC = () => {
  const { user, logout, collaborationRequests, chatMessages } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>('dashboard');
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  // Count unread messages and pending requests
  const unreadMessages = chatMessages.filter(msg => 
    msg.receiverId === user.id && !msg.timestamp // Simple unread logic
  ).length;

  const pendingRequests = collaborationRequests.filter(req => 
    (user.role === 'entrepreneur' ? req.entrepreneurId === user.id : req.investorId === user.id) &&
    req.status === 'pending'
  ).length;

  const handleChatOpen = (userId: string) => {
    setSelectedChatUserId(userId);
    setCurrentView('chat');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  const sidebarItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      badge: pendingRequests > 0 ? pendingRequests : null
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      badge: null
    },
    {
      id: 'chat',
      label: 'Messages',
      icon: MessageCircle,
      badge: unreadMessages > 0 ? unreadMessages : null
    }
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return user.role === 'investor' ? 
          <InvestorDashboard onChatOpen={handleChatOpen} /> : 
          <EntrepreneurDashboard onChatOpen={handleChatOpen} />;
      case 'profile':
        return <ProfileView />;
      case 'chat':
        return <ChatView selectedUserId={selectedChatUserId} onBack={() => setCurrentView('dashboard')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold text-primary">
          Business<span className="text-blue-600">Nexus</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          initial={false}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center px-6 py-4 border-b border-gray-200">
              <div className="text-xl font-bold text-primary">
                Business<span className="text-blue-600">Nexus</span>
              </div>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as DashboardView);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${currentView === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                  {item.badge && (
                    <Badge className="ml-auto bg-red-500 text-white text-xs px-2 py-1">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </motion.aside>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="min-h-screen">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;