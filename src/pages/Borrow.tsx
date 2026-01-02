import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Plus, 
  HandHeart, 
  Clock, 
  User,
  DollarSign,
  Calendar,
  Check,
  RotateCcw,
  Users,
  Filter,
  Search
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Borrow() {
  const { user } = useAuth();
  const { borrowItems, addBorrowItem, borrowItem, returnItem } = useData();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'available' | 'borrowed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Create item state
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [isFriendOnly, setIsFriendOnly] = useState(false);
  const [price, setPrice] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [availableTo, setAvailableTo] = useState('');

  const filteredItems = borrowItems.filter(item => {
    if (filter === 'available' && item.status !== 'available') return false;
    if (filter === 'borrowed' && item.status !== 'borrowed') return false;
    if (searchQuery && !item.item.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleCreate = () => {
    if (!itemName.trim() || !description.trim() || !availableFrom || !availableTo) {
      toast.error('Please fill all required fields');
      return;
    }

    addBorrowItem({
      item: itemName.trim(),
      description: description.trim(),
      price: isFriendOnly ? 0 : parseFloat(price) || 0,
      availableFrom,
      availableTo,
      isFriendOnly,
    });

    toast.success('Item listed successfully!');
    setIsCreateOpen(false);
    setItemName('');
    setDescription('');
    setIsFriendOnly(false);
    setPrice('');
    setAvailableFrom('');
    setAvailableTo('');
  };

  const handleBorrow = (itemId: string) => {
    borrowItem(itemId);
    toast.success('Item borrowed successfully!');
  };

  const handleReturn = (itemId: string) => {
    returnItem(itemId);
    toast.success('Item returned successfully!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Borrow / Give</h1>
            <p className="text-muted-foreground">
              Lend items to friends for free, or to others for a small fee
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="w-4 h-4" />
                List Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>List Item for Borrowing</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Item Name</Label>
                  <Input
                    placeholder="e.g., Laptop, Calculator, Book"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the item..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Available From</Label>
                    <Input
                      type="date"
                      value={availableFrom}
                      onChange={(e) => setAvailableFrom(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Available To</Label>
                    <Input
                      type="date"
                      value={availableTo}
                      onChange={(e) => setAvailableTo(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div>
                    <p className="font-medium text-foreground">Friends Only (Free)</p>
                    <p className="text-sm text-muted-foreground">No charge for friends</p>
                  </div>
                  <Switch
                    checked={isFriendOnly}
                    onCheckedChange={setIsFriendOnly}
                  />
                </div>
                {!isFriendOnly && (
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      placeholder="Enter price per day"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                )}
                <Button onClick={handleCreate} className="w-full" variant="gradient">
                  List Item
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
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="borrowed">Borrowed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isOwner = item.ownerId === user?.uid;
              const isBorrower = item.borrowerId === user?.uid;

              return (
                <div key={item.id} className="glass-card rounded-xl p-5 card-hover">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      item.status === 'available' ? 'bg-success/10' : 'bg-warning/10'
                    }`}>
                      <HandHeart className={`w-6 h-6 ${
                        item.status === 'available' ? 'text-success' : 'text-warning'
                      }`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground line-clamp-1">{item.item}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                          item.status === 'available' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {item.status}
                        </span>
                        {item.isFriendOnly && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Friends
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {item.ownerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.availableFrom).toLocaleDateString()} - {new Date(item.availableTo).toLocaleDateString()}
                    </span>
                    {!item.isFriendOnly && item.price > 0 && (
                      <span className="flex items-center gap-1 text-success">
                        <DollarSign className="w-3 h-3" />
                        ₹{item.price}/day
                      </span>
                    )}
                  </div>

                  {item.status === 'borrowed' && item.borrowerName && (
                    <p className="text-xs text-muted-foreground mb-4">
                      Borrowed by: <span className="text-foreground">{item.borrowerName}</span>
                    </p>
                  )}

                  {item.status === 'available' && !isOwner && (
                    <Button
                      onClick={() => handleBorrow(item.id)}
                      variant="default"
                      className="w-full"
                    >
                      <Check className="w-4 h-4" />
                      Borrow Item
                    </Button>
                  )}

                  {isBorrower && (
                    <Button
                      onClick={() => handleReturn(item.id)}
                      variant="secondary"
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Return Item
                    </Button>
                  )}

                  {isOwner && item.status === 'borrowed' && (
                    <Button
                      onClick={() => handleReturn(item.id)}
                      variant="outline"
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Mark as Returned
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-xl">
            <HandHeart className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">
              Be the first to list an item for borrowing!
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
