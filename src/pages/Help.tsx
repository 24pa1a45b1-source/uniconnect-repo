import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Plus, 
  HelpCircle, 
  Clock, 
  User,
  CheckCircle,
  Filter,
  Search,
  Laptop,
  BookOpen,
  Wrench,
  Users,
  MessageCircle
} from 'lucide-react';

const categories = [
  { value: 'academic', label: 'Academic Help', icon: BookOpen },
  { value: 'technical', label: 'Technical Support', icon: Laptop },
  { value: 'general', label: 'General Assistance', icon: Wrench },
  { value: 'social', label: 'Social / Group', icon: Users },
];

export default function Help() {
  const { user } = useAuth();
  const { helpRequests, addHelpRequest, resolveHelpRequest } = useData();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Create request state
  const [request, setRequest] = useState('');
  const [category, setCategory] = useState('');

  const filteredRequests = helpRequests.filter(req => {
    if (filter === 'pending' && req.status !== 'pending') return false;
    if (filter === 'resolved' && req.status !== 'resolved') return false;
    if (searchQuery && !req.request.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleCreate = () => {
    if (!request.trim() || !category) {
      toast.error('Please fill all required fields');
      return;
    }

    addHelpRequest({
      request: request.trim(),
      category,
    });

    toast.success('Help request posted!');
    setIsCreateOpen(false);
    setRequest('');
    setCategory('');
  };

  const handleResolve = (requestId: string) => {
    resolveHelpRequest(requestId);
    toast.success('Request marked as resolved!');
  };

  const getCategoryIcon = (cat: string) => {
    return categories.find(c => c.value === cat)?.icon || HelpCircle;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Help Requests</h1>
            <p className="text-muted-foreground">
              Ask for help or assist fellow students
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="w-4 h-4" />
                Request Help
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Request Help</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <cat.icon className="w-4 h-4" />
                            {cat.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>What do you need help with?</Label>
                  <Textarea
                    placeholder="Describe your request in detail..."
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={handleCreate} className="w-full" variant="gradient">
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Requests Grid */}
        {filteredRequests.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredRequests.map((req) => {
              const isOwner = req.requesterId === user?.uid;
              const CategoryIcon = getCategoryIcon(req.category);
              const isPending = req.status === 'pending';

              return (
                <div key={req.id} className={`glass-card rounded-xl p-5 card-hover ${
                  !isPending ? 'opacity-60' : ''
                }`}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isPending ? 'bg-warning/10' : 'bg-success/10'
                    }`}>
                      <CategoryIcon className={`w-6 h-6 ${
                        isPending ? 'text-warning' : 'text-success'
                      }`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${
                          isPending 
                            ? 'bg-warning/10 text-warning' 
                            : 'bg-success/10 text-success'
                        }`}>
                          {req.status}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
                          {req.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-foreground mb-4 line-clamp-3">
                    {req.request}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {req.requesterName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {isOwner && isPending && (
                      <Button
                        onClick={() => handleResolve(req.id)}
                        variant="success"
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Resolved
                      </Button>
                    )}
                    
                    {!isOwner && isPending && (
                      <Button
                        variant="default"
                        className="flex-1"
                        onClick={() => toast.info('Contact feature coming soon!')}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Offer Help
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-xl">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No help requests found</h3>
            <p className="text-muted-foreground">
              Post a request or help others!
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
