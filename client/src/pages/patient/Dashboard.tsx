
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import ClaimCard from '@/components/ClaimCard';
import { Claim, ClaimStatus } from '@/lib/types';
import axios from 'axios';

const PatientDashboard = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [activeTab, setActiveTab] = useState<ClaimStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Load claims
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        if (!user || !user.id) return;
        const userId = user.id;
        
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}api/claims/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        const allClaims = response.data.data;
        setClaims(allClaims);
        setFilteredClaims(allClaims);
      } catch (err) {
        console.log(err);
      }
    }
    fetchClaims();
  }, []);
  
  // Filter claims when tab or search changes
  useEffect(() => {
    let filtered = claims;
    
    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter(claim => claim.status === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(claim => 
        claim.description.toLowerCase().includes(term) ||
        claim.status.toLowerCase().includes(term)
      );
    }
    
    setFilteredClaims(filtered);
  }, [activeTab, searchTerm, claims]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as ClaimStatus | 'all');
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSubmitNewClaim = () => {
    navigate('/patient/submit');
  };
  
  const getTotalClaimAmount = () => {
    return claims.reduce((total, claim) => total + claim.amount, 0);
  };
  
  const getApprovedClaimAmount = () => {
    return claims
      .filter(claim => claim.status === 'approved')
      .reduce((total, claim) => total + (claim.approvedAmount || 0), 0);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Claims Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your submitted claims</p>
        </div>
        
        <Button onClick={handleSubmitNewClaim} className="flex gap-2">
          <Plus className="h-4 w-4" />
          <span>Submit New Claim</span>
        </Button>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Total Claims</CardDescription>
            <CardTitle className="text-2xl">{claims.length}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Total Amount Claimed</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(getTotalClaimAmount())}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Total Amount Approved</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(getApprovedClaimAmount())}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      {/* Claims list */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle>Claims History</CardTitle>
              <CardDescription>View and manage your claims</CardDescription>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search claims..." 
                className="pl-9 w-full md:w-[250px]"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {filteredClaims.length > 0 ? (
                <div className="grid gap-4">
                  {filteredClaims.map((claim, id) => (
                    <ClaimCard 
                      key={id} 
                      claim={claim} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No claims found</p>
                  {activeTab === 'all' && claims.length === 0 && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={handleSubmitNewClaim}
                    >
                      Submit your first claim
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboard;
