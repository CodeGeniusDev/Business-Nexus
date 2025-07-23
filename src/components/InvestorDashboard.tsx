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
  Target
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface InvestorDashboardProps {
  onChatOpen: (userId: string) => void;
}

const InvestorDashboard: React.FC<InvestorDashboardProps> = ({ onChatOpen }) => {
  const { user, users, sendCollaborationRequest } = useAuth();
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState<any>(null);
  const [collaborationMessage, setCollaborationMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  if (!user) return null;

  const entrepreneurs = users.filter(u => u.role === 'entrepreneur');

  const handleSendRequest = () => {
    if (!selectedEntrepreneur || !collaborationMessage.trim()) return;

    sendCollaborationRequest(selectedEntrepreneur.id, collaborationMessage);
    toast({
      title: "Collaboration request sent!",
      description: `Your request has been sent to ${selectedEntrepreneur.name}.`,
    });
    setCollaborationMessage('');
    setIsDialogOpen(false);
    setSelectedEntrepreneur(null);
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
          Discover promising entrepreneurs and investment opportunities
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeInUp}>
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Available Entrepreneurs</p>
                  <p className="text-2xl font-bold text-blue-900">{entrepreneurs.length}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
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
                  <p className="text-sm font-medium text-green-600 mb-1">Portfolio Companies</p>
                  <p className="text-2xl font-bold text-green-900">
                    {user.portfolioCompanies?.length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
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
                  <p className="text-sm font-medium text-purple-600 mb-1">Investment Areas</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {user.investmentInterests?.length || 0}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Investment Interests */}
      {user.investmentInterests && user.investmentInterests.length > 0 && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                Your Investment Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.investmentInterests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Entrepreneurs List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Discover Entrepreneurs</h2>
          <Badge variant="outline" className="text-sm">
            {entrepreneurs.length} Available
          </Badge>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {entrepreneurs.map((entrepreneur) => (
            <motion.div key={entrepreneur.id} variants={fadeInUp}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={entrepreneur.avatar} alt={entrepreneur.name} />
                      <AvatarFallback>{entrepreneur.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {entrepreneur.name}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        {entrepreneur.startupName || 'Startup'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {entrepreneur.pitchSummary || entrepreneur.bio || 'No description available'}
                    </p>
                    
                    {entrepreneur.fundingNeed && (
                      <div className="flex items-center text-sm text-green-600">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {entrepreneur.fundingNeed}
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
                              <AvatarImage src={entrepreneur.avatar} alt={entrepreneur.name} />
                              <AvatarFallback>{entrepreneur.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-xl font-bold">{entrepreneur.name}</h3>
                              <p className="text-sm text-gray-500">{entrepreneur.startupName}</p>
                            </div>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">About</h4>
                            <p className="text-gray-600">{entrepreneur.bio}</p>
                          </div>
                          {entrepreneur.pitchSummary && (
                            <div>
                              <h4 className="font-semibold mb-2">Pitch Summary</h4>
                              <p className="text-gray-600">{entrepreneur.pitchSummary}</p>
                            </div>
                          )}
                          {entrepreneur.fundingNeed && (
                            <div>
                              <h4 className="font-semibold mb-2">Funding Need</h4>
                              <p className="text-green-600 font-medium">{entrepreneur.fundingNeed}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      size="sm" 
                      onClick={() => onChatOpen(entrepreneur.id)}
                      variant="outline"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>

                    <Button 
                      size="sm" 
                      onClick={() => {
                        setSelectedEntrepreneur(entrepreneur);
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

        {entrepreneurs.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No entrepreneurs found</h3>
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
            {selectedEntrepreneur && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedEntrepreneur.avatar} alt={selectedEntrepreneur.name} />
                  <AvatarFallback>{selectedEntrepreneur.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedEntrepreneur.name}</p>
                  <p className="text-sm text-gray-500">{selectedEntrepreneur.startupName}</p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                placeholder="Introduce yourself and explain why you're interested in collaborating..."
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

export default InvestorDashboard;