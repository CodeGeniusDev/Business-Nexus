import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'investor' | 'entrepreneur';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  // Investor specific fields
  investmentInterests?: string[];
  portfolioCompanies?: string[];
  // Entrepreneur specific fields
  startupName?: string;
  pitchSummary?: string;
  fundingNeed?: string;
  pitchDeck?: string;
}

export interface CollaborationRequest {
  id: string;
  investorId: string;
  entrepreneurId: string;
  investorName: string;
  entrepreneurName: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  senderName: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  collaborationRequests: CollaborationRequest[];
  chatMessages: ChatMessage[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  sendCollaborationRequest: (targetUserId: string, message: string) => void;
  updateCollaborationRequest: (requestId: string, status: 'accepted' | 'rejected') => void;
  sendMessage: (receiverId: string, message: string) => void;
  getChatHistory: (userId1: string, userId2: string) => ChatMessage[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedUsers = localStorage.getItem('users');
    const savedRequests = localStorage.getItem('collaborationRequests');
    const savedMessages = localStorage.getItem('chatMessages');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize with some demo data
      const demoUsers: User[] = [
        {
          id: '1',
          email: 'john.investor@example.com',
          name: 'John Smith',
          role: 'investor',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          bio: 'Experienced investor with 15+ years in tech startups',
          investmentInterests: ['FinTech', 'AI/ML', 'SaaS'],
          portfolioCompanies: ['TechCorp', 'DataFlow', 'CloudSync']
        },
        {
          id: '2',
          email: 'sarah.entrepreneur@example.com',
          name: 'Sarah Johnson',
          role: 'entrepreneur',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          bio: 'Serial entrepreneur passionate about sustainable technology',
          startupName: 'EcoTech Solutions',
          pitchSummary: 'Revolutionary green technology for sustainable manufacturing',
          fundingNeed: '$2M Series A',
          pitchDeck: 'https://example.com/pitch-deck'
        },
        {
          id: '3',
          email: 'mike.investor@example.com',
          name: 'Mike Chen',
          role: 'investor',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          bio: 'Angel investor focused on early-stage startups',
          investmentInterests: ['HealthTech', 'EdTech', 'CleanTech'],
          portfolioCompanies: ['MedFlow', 'LearnFast', 'GreenEnergy']
        },
        {
          id: '4',
          email: 'emma.entrepreneur@example.com',
          name: 'Emma Davis',
          role: 'entrepreneur',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          bio: 'Building the future of healthcare technology',
          startupName: 'HealthAI',
          pitchSummary: 'AI-powered diagnostic tools for early disease detection',
          fundingNeed: '$5M Series B',
          pitchDeck: 'https://example.com/healthai-pitch'
        }
      ];
      setUsers(demoUsers);
      localStorage.setItem('users', JSON.stringify(demoUsers));
    }
    if (savedRequests) {
      setCollaborationRequests(JSON.parse(savedRequests));
    }
    if (savedMessages) {
      setChatMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('collaborationRequests', JSON.stringify(collaborationRequests));
  }, [collaborationRequests]);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    delete (newUser as any).password;

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  const sendCollaborationRequest = (targetUserId: string, message: string) => {
    if (!user) return;

    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser) return;

    const newRequest: CollaborationRequest = {
      id: Date.now().toString(),
      investorId: user.role === 'investor' ? user.id : targetUserId,
      entrepreneurId: user.role === 'entrepreneur' ? user.id : targetUserId,
      investorName: user.role === 'investor' ? user.name : targetUser.name,
      entrepreneurName: user.role === 'entrepreneur' ? user.name : targetUser.name,
      status: 'pending',
      message,
      createdAt: new Date().toISOString(),
    };

    setCollaborationRequests(prev => [...prev, newRequest]);
  };

  const updateCollaborationRequest = (requestId: string, status: 'accepted' | 'rejected') => {
    setCollaborationRequests(prev =>
      prev.map(req => req.id === requestId ? { ...req, status } : req)
    );
  };

  const sendMessage = (receiverId: string, message: string) => {
    if (!user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
      senderName: user.name,
    };

    setChatMessages(prev => [...prev, newMessage]);
  };

  const getChatHistory = (userId1: string, userId2: string): ChatMessage[] => {
    return chatMessages
      .filter(msg =>
        (msg.senderId === userId1 && msg.receiverId === userId2) ||
        (msg.senderId === userId2 && msg.receiverId === userId1)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const value: AuthContextType = {
    user,
    users,
    collaborationRequests,
    chatMessages,
    login,
    register,
    logout,
    updateProfile,
    sendCollaborationRequest,
    updateCollaborationRequest,
    sendMessage,
    getChatHistory,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};