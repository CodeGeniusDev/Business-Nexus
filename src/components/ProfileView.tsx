import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Building, 
  DollarSign, 
  Target, 
  Edit3,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProfileView: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    // Entrepreneur fields
    startupName: user?.startupName || '',
    pitchSummary: user?.pitchSummary || '',
    fundingNeed: user?.fundingNeed || '',
    pitchDeck: user?.pitchDeck || '',
    // Investor fields
    investmentInterests: user?.investmentInterests || [],
    portfolioCompanies: user?.portfolioCompanies || []
  });
  const [newInterest, setNewInterest] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const { toast } = useToast();

  if (!user) return null;

  const handleSave = () => {
    updateProfile(editForm);
    setIsEditing(false);
    toast({
      title: "Profile updated!",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      bio: user.bio || '',
      avatar: user.avatar || '',
      startupName: user.startupName || '',
      pitchSummary: user.pitchSummary || '',
      fundingNeed: user.fundingNeed || '',
      pitchDeck: user.pitchDeck || '',
      investmentInterests: user.investmentInterests || [],
      portfolioCompanies: user.portfolioCompanies || []
    });
    setIsEditing(false);
  };

  const addInterest = () => {
    if (newInterest.trim() && !editForm.investmentInterests.includes(newInterest.trim())) {
      setEditForm(prev => ({
        ...prev,
        investmentInterests: [...prev.investmentInterests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setEditForm(prev => ({
      ...prev,
      investmentInterests: prev.investmentInterests.filter(i => i !== interest)
    }));
  };

  const addCompany = () => {
    if (newCompany.trim() && !editForm.portfolioCompanies.includes(newCompany.trim())) {
      setEditForm(prev => ({
        ...prev,
        portfolioCompanies: [...prev.portfolioCompanies, newCompany.trim()]
      }));
      setNewCompany('');
    }
  };

  const removeCompany = (company: string) => {
    setEditForm(prev => ({
      ...prev,
      portfolioCompanies: prev.portfolioCompanies.filter(c => c !== company)
    }));
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your profile information</p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </motion.div>

      <div className="space-y-6">
        {/* Basic Information */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={isEditing ? editForm.avatar : user.avatar} alt={user.name} />
                    <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="mt-3">
                      <Label htmlFor="avatar" className="text-sm">Avatar URL</Label>
                      <Input
                        id="avatar"
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        value={editForm.avatar}
                        onChange={(e) => setEditForm(prev => ({ ...prev, avatar: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900 font-medium">{user.name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900 flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        className="mt-1"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="mt-1 text-gray-600">{user.bio || 'No bio available'}</p>
                    )}
                  </div>
                  <div>
                    <Badge variant="secondary" className="capitalize">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Role-specific Information */}
        {user.role === 'entrepreneur' && (
          <motion.div 
            variants={fadeInUp} 
            initial="initial" 
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2 text-green-600" />
                  Startup Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startupName">Startup Name</Label>
                      {isEditing ? (
                        <Input
                          id="startupName"
                          value={editForm.startupName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, startupName: e.target.value }))}
                          className="mt-1"
                          placeholder="Your startup name"
                        />
                      ) : (
                        <p className="mt-1 text-gray-900 font-medium">
                          {user.startupName || 'Not specified'}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="fundingNeed">Funding Need</Label>
                      {isEditing ? (
                        <Input
                          id="fundingNeed"
                          value={editForm.fundingNeed}
                          onChange={(e) => setEditForm(prev => ({ ...prev, fundingNeed: e.target.value }))}
                          className="mt-1"
                          placeholder="e.g., $1M Series A"
                        />
                      ) : (
                        <p className="mt-1 text-green-600 font-medium flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {user.fundingNeed || 'Not specified'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pitchSummary">Pitch Summary</Label>
                    {isEditing ? (
                      <Textarea
                        id="pitchSummary"
                        value={editForm.pitchSummary}
                        onChange={(e) => setEditForm(prev => ({ ...prev, pitchSummary: e.target.value }))}
                        rows={3}
                        className="mt-1"
                        placeholder="Brief description of your startup..."
                      />
                    ) : (
                      <p className="mt-1 text-gray-600">
                        {user.pitchSummary || 'No pitch summary available'}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="pitchDeck">Pitch Deck URL</Label>
                    {isEditing ? (
                      <Input
                        id="pitchDeck"
                        type="url"
                        value={editForm.pitchDeck}
                        onChange={(e) => setEditForm(prev => ({ ...prev, pitchDeck: e.target.value }))}
                        className="mt-1"
                        placeholder="https://example.com/pitch-deck.pdf"
                      />
                    ) : (
                      <p className="mt-1">
                        {user.pitchDeck ? (
                          <a 
                            href={user.pitchDeck} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Pitch Deck
                          </a>
                        ) : (
                          <span className="text-gray-500">No pitch deck uploaded</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {user.role === 'investor' && (
          <motion.div 
            variants={fadeInUp} 
            initial="initial" 
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-purple-600" />
                  Investment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Investment Interests */}
                  <div>
                    <Label>Investment Interests</Label>
                    <div className="mt-2">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {editForm.investmentInterests.map((interest, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary" 
                                className="flex items-center gap-1"
                              >
                                {interest}
                                <button
                                  onClick={() => removeInterest(interest)}
                                  className="ml-1 hover:text-red-600"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              value={newInterest}
                              onChange={(e) => setNewInterest(e.target.value)}
                              placeholder="Add investment interest"
                              onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                            />
                            <Button onClick={addInterest} size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {user.investmentInterests && user.investmentInterests.length > 0 ? (
                            user.investmentInterests.map((interest, index) => (
                              <Badge key={index} variant="secondary">
                                {interest}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-gray-500">No investment interests specified</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Portfolio Companies */}
                  <div>
                    <Label>Portfolio Companies</Label>
                    <div className="mt-2">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {editForm.portfolioCompanies.map((company, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="flex items-center gap-1"
                              >
                                {company}
                                <button
                                  onClick={() => removeCompany(company)}
                                  className="ml-1 hover:text-red-600"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              value={newCompany}
                              onChange={(e) => setNewCompany(e.target.value)}
                              placeholder="Add portfolio company"
                              onKeyPress={(e) => e.key === 'Enter' && addCompany()}
                            />
                            <Button onClick={addCompany} size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {user.portfolioCompanies && user.portfolioCompanies.length > 0 ? (
                            user.portfolioCompanies.map((company, index) => (
                              <Badge key={index} variant="outline">
                                {company}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-gray-500">No portfolio companies listed</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;