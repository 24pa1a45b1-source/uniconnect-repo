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
  Search, 
  Clock, 
  User,
  MapPin,
  Mail,
  CheckCircle,
  Filter,
  AlertCircle,
  Eye
} from 'lucide-react';

export default function LostFound() {
  const { user } = useAuth();
  const { lostFoundItems, addLostFoundItem, markAsFound } = useData();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Create item state
  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'lost' | 'found'>('lost');
  const [contactEmail, setContactEmail] = useState('');

  const filteredItems = lostFoundItems.filter(item => {
    if (filter === 'lost' && item.status !== 'lost') return false;
    if (filter === 'found' && item.status !== 'found') return false;
    if (searchQuery && !item.item.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleCreate = () => {
    if (!itemName.trim() || !location.trim() || !description.trim() || !contactEmail.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    addLostFoundItem({
      item: itemName.trim(),
      location: location.trim(),
      description: description.trim(),
      status,
      contactEmail: contactEmail.trim(),
    });

    toast.success(`${status === 'lost' ? 'Lost item reported' : 'Found item posted'}!`);
    setIsCreateOpen(false);
    setItemName('');
    setLocation('');
    setDescription('');
    setStatus('lost');
    setContactEmail('');
  };

  const handleMarkAsFound = (itemId: string) => {
    markAsFound(itemId);
    toast.success('Item marked as found!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Lost & Found</h1>
            <p className="text-muted-foreground">
              Report lost items or help others find their belongings
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="w-4 h-4" />
                Report Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Report Lost or Found Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('lost')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      status === 'lost'
                        ? 'border-destructive bg-destructive/10 text-destructive'
                        : 'border-border hover:border-destructive/50'
                    }`}
                  >
                    <AlertCircle className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Lost Item</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('found')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      status === 'found'
                        ? 'border-success bg-success/10 text-success'
                        : 'border-border hover:border-success/50'
                    }`}
                  >
                    <Eye className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Found Item</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <Label>Item Name</Label>
                  <Input
                    placeholder="e.g., Black Wallet, Student ID Card"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="e.g., Library, Cafeteria, Lab 204"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the item in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Email</Label>
                  <Input
                    type="email"
                    placeholder="your@email.edu.in"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreate} className="w-full" variant="gradient">
                  Submit Report
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
              placeholder="Search items..."
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
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
              <SelectItem value="found">Found</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isOwner = item.ownerId === user?.uid;
              const isLost = item.status === 'lost';

              return (
                <div key={item.id} className={`glass-card rounded-xl p-5 card-hover border-l-4 ${
                  isLost ? 'border-l-destructive' : 'border-l-success'
                }`}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isLost ? 'bg-destructive/10' : 'bg-success/10'
                    }`}>
                      {isLost ? (
                        <AlertCircle className="w-6 h-6 text-destructive" />
                      ) : (
                        <Eye className="w-6 h-6 text-success" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground line-clamp-1">{item.item}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full uppercase font-medium ${
                        isLost 
                          ? 'bg-destructive/10 text-destructive' 
                          : 'bg-success/10 text-success'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {item.description}
                  </p>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{item.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(item.reportedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isOwner && isLost && (
                      <Button
                        onClick={() => handleMarkAsFound(item.id)}
                        variant="success"
                        className="flex-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Found It
                      </Button>
                    )}
                    
                    {!isOwner && (
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          navigator.clipboard.writeText(item.contactEmail);
                          toast.success('Email copied to clipboard!');
                        }}
                      >
                        <Mail className="w-4 h-4" />
                        Contact
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-xl">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">
              Report a lost or found item to get started
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
