
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ArrowUp, 
  ArrowDown, 
  Calendar, 
  DollarSign,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ClaimCard from '@/components/ClaimCard';
import { Claim, ClaimStatus } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import axios from 'axios';
import claimsStore from '@/store/claimStore';

type SortField = 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

const InsurerDashboard = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([]);
  const [activeTab, setActiveTab] = useState<ClaimStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [dateRange, setDateRange] = useState<Date | undefined>(undefined);
  const navigate = useNavigate();
  
  // Load claims
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/claims`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        const allClaims = response.data.data;
        setClaims(allClaims);
        setFilteredClaims(allClaims);
        claimsStore.setClaims(allClaims);
      } catch (err) {
        console.log(err);
      }
    }
    fetchClaims();
  }, []);
  
  // Filter and sort claims
  useEffect(() => {
    let filtered = [...claims];
    
    // Filter by status
    if (activeTab !== 'all') {
      filtered = filtered.filter(claim => claim.status === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(claim => 
        claim.description.toLowerCase().includes(term) ||
        claim.patientName.toLowerCase().includes(term) ||
        claim.patientEmail.toLowerCase().includes(term)
      );
    }
    
    // Filter by date
    if (dateRange) {
      filtered = filtered.filter(claim => {
        const claimDate = new Date(claim.submissionDate).setHours(0, 0, 0, 0);
        const filterDate = new Date(dateRange).setHours(0, 0, 0, 0);
        return claimDate === filterDate;
      });
    }
    
    // Sort claims
    filtered.sort((a, b) => {
      if (sortField === 'date') {
        const dateA = new Date(a.submissionDate).getTime();
        const dateB = new Date(b.submissionDate).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });
    
    setFilteredClaims(filtered);
  }, [activeTab, searchTerm, claims, sortField, sortDirection, dateRange]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as ClaimStatus | 'all');
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const handleReviewClaim = (claim: Claim) => {
    navigate(`/insurer/review/${claim._id}`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setActiveTab('all');
    setSortField('date');
    setSortDirection('desc');
    setDateRange(undefined);
  };
  
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  // Statistics
  const getPendingClaimsCount = () => {
    return claims.filter(claim => claim.status === 'pending').length;
  };
  
  const getAverageClaimAmount = () => {
    if (claims.length === 0) return 0;
    const total = claims.reduce((sum, claim) => sum + claim.amount, 0);
    return total / claims.length;
  };
  
  const getTotalApprovedAmount = () => {
    return claims
      .filter(claim => claim.status === 'approved')
      .reduce((sum, claim) => sum + (claim.approvedAmount || 0), 0);
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
          <h1 className="text-3xl font-bold tracking-tight">Claims Dashboard</h1>
          <p className="text-muted-foreground mt-1">Review and manage submitted claims</p>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Pending Claims</CardDescription>
            <CardTitle className="text-2xl">{getPendingClaimsCount()}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Average Claim Amount</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(getAverageClaimAmount())}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardDescription>Total Approved Amount</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(getTotalApprovedAmount())}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      {/* Claims list */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <CardTitle>Claims Management</CardTitle>
              <CardDescription>Review and process submitted claims</CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search claims..." 
                  className="pl-9 w-full"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    {dateRange ? format(dateRange, 'PPP') : 'Date Filter'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={dateRange}
                    onSelect={setDateRange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Button variant="ghost" onClick={resetFilters} className="whitespace-nowrap">
                Reset Filters
              </Button>
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
            
            <div className="flex gap-2 mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => toggleSort('date')}
              >
                <FileText className="h-4 w-4" />
                <span>Date</span>
                <SortIcon field="date" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => toggleSort('amount')}
              >
                <DollarSign className="h-4 w-4" />
                <span>Amount</span>
                <SortIcon field="amount" />
              </Button>
            </div>
            
            <TabsContent value={activeTab}>
              {filteredClaims.length > 0 ? (
                <div className="grid gap-4">
                  {filteredClaims.map((claim, id) => (
                    <ClaimCard 
                      key={id} 
                      claim={claim} 
                      onClick={() => handleReviewClaim(claim)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No claims found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsurerDashboard;
