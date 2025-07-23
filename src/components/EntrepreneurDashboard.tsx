import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Building, 
  DollarSign, 
  MessageCircle, 
  Eye, 
  Send,
  TrendingUp,
  Users,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Mail
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface EntrepreneurDashboardProps {
  onChatOpen: (userId: string) => void;
}

const EntrepreneurDashboard: React.FC<EntrepreneurDashboardProps> = ({ onChatOpen }) => {
  const { user, users, collaborationRequests, updateCollaborationRequest, sendCollaborationRequest } = useAuth();
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [collaborationMessage, setCollaborationMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  if (!user) return null;

  const investors = users.filter(u => u.role === 'investor');
  const myRequests = collaborationRequests.filter(req => req.entrepreneurId === user.id);
  const pendingRequests = myRequests.filter(req => req.status === 'pending');
  const acceptedRequests = myRequests.filter(req => req.status === 'accepted');

  const handleSendRequest = () => {
    if (!selectedInvestor || !collaborationMessage.trim()) return;

    sendCollaborationRequest(selectedInvestor.id, collaborationMessage);
    toast({
      title: "Collaboration request sent!",
      description: `Your request has been sent to ${selectedInvestor.name}.`,
    });
    setCollaborationMessage('');
    setIsDialogOpen(false);
    setSelectedInvestor(null);
  };

  const handleRequestResponse = (requestId: string, status: 'accepted' | 'rejected') => {
    updateCollaborationRequest(requestId, status);
    toast({
      title: status === 'accepted' ? "Request accepted!" : "Request declined",
      description: `You have ${status} the collaboration request.`,
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}
        </h1>
        <p className="text-gray-600">
          Manage your startup profile and connect with potential investors
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeInUp}>
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Available Investors</p>
                  <p className="text-2xl font-bold text-blue-900">{investors.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 mb-1">Pending Requests</p>
                  <p className="text-2xl font-bold text-yellow-900">{pendingRequests.length}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Active Connections</p>
                  <p className="text-2xl font-bold text-green-900">{acceptedRequests.length}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">Funding Goal</p>
                  <p className="text-lg font-bold text-purple-900">
                    {user.fundingNeed || 'Not set'}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Startup Info */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2 text-blue-600" />
              Your Startup Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Startup Name</h4>
                <p className="text-gray-600">{user.startupName || 'Not specified'}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Funding Need</h4>
                <p className="text-green-600 font-medium">{user.fundingNeed || 'Not specified'}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold mb-2">Pitch Summary</h4>
                <p className="text-gray-600">{user.pitchSummary || 'No pitch summary available'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Collaboration Requests */}
      {pendingRequests.length > 0 && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-yellow-600" />
                Pending Collaboration Requests
                <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                  {pendingRequests.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.map((request) => {
                  const investor = users.find(u => u.id === request.investorId);
                  if (!investor) return null;

                  return (
                    <div key={request.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={investor.avatar} alt={investor.name} />
                        <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{investor.name}</h4>
                          <span className="text-xs text-gray-500">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{request.message}</p>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleRequestResponse(request.id, 'accepted')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRequestResponse(request.id, 'rejected')}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Decline
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onChatOpen(investor.id)}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Investors List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Discover Investors</h2>
          <Badge variant="outline" className="text-sm">
            {investors.length} Available
          </Badge>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {investors.map((investor) => (
            <motion.div key={investor.id} variants={fadeInUp}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={investor.avatar} alt={investor.name} />
                      <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {investor.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Investor
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {investor.bio || 'No description available'}
                    </p>
                    
                    {investor.investmentInterests && investor.investmentInterests.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Investment Interests:</p>
                        <div className="flex flex-wrap gap-1">
                          {investor.investmentInterests.slice(0, 3).map((interest, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                          {investor.investmentInterests.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{investor.investmentInterests.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={investor.avatar} alt={investor.name} />
                              <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-bold">{investor.name}</h3>
                              <p className="text-sm text-gray-500">Investor</p>
                            </div>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">About</h4>
                            <p className="text-gray-600">{investor.bio}</p>
                          </div>
                          {investor.investmentInterests && investor.investmentInterests.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Investment Interests</h4>
                              <div className="flex flex-wrap gap-2">
                                {investor.investmentInterests.map((interest, index) => (
                                  <Badge key={index} variant="secondary">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {investor.portfolioCompanies && investor.portfolioCompanies.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Portfolio Companies</h4>
                              <div className="flex flex-wrap gap-2">
                                {investor.portfolioCompanies.map((company, index) => (
                                  <Badge key={index} variant="outline">
                                    {company}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      size="sm" 
                      onClick={() => onChatOpen(investor.id)}
                      variant="outline"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>

                    <Button 
                      size="sm" 
                      onClick={() => {
                        setSelectedInvestor(investor);
                        setIsDialogOpen(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {investors.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No investors found</h3>
            <p className="text-gray-500">Check back later for new opportunities.</p>
          </motion.div>
        )}
      </motion.div>

      {/* Collaboration Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Collaboration Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedInvestor && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedInvestor.avatar} alt={selectedInvestor.name} />
                  <AvatarFallback>{selectedInvestor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedInvestor.name}</p>
                  <p className="text-sm text-gray-500">Investor</p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Introduce your startup and explain why you'd like to connect..."
                value={collaborationMessage}
                onChange={(e) => setCollaborationMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendRequest}
                disabled={!collaborationMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Send Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EntrepreneurDashboard;