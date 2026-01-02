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
  ShoppingBag, 
  Clock, 
  User,
  IndianRupee,
  Tag,
  CheckCircle,
  Filter,
  Search,
  Package
} from 'lucide-react';

const conditions = ['New', 'Like New', 'Good', 'Fair', 'Used'];

export default function Marketplace() {
  const { user } = useAuth();
  const { sellItems, addSellItem, markAsSold } = useData();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'available' | 'sold'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Create item state
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState('');

  const filteredItems = sellItems.filter(item => {
    if (filter === 'available' && item.status !== 'available') return false;
    if (filter === 'sold' && item.status !== 'sold') return false;
    if (searchQuery && !item.item.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleCreate = () => {
    if (!itemName.trim() || !description.trim() || !price || !condition) {
      toast.error('Please fill all required fields');
      return;
    }

    addSellItem({
      item: itemName.trim(),
      description: description.trim(),
      price: parseFloat(price),
      condition,
    });

    toast.success('Item listed for sale!');
    setIsCreateOpen(false);
    setItemName('');
    setDescription('');
    setPrice('');
    setCondition('');
  };

  const handleMarkAsSold = (itemId: string) => {
    markAsSold(itemId);
    toast.success('Item marked as sold!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Marketplace</h1>
            <p className="text-muted-foreground">
              Buy and sell second-hand books, calculators, drafters & more
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="w-4 h-4" />
                Sell Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>List Item for Sale</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Item Name</Label>
                  <Input
                    placeholder="e.g., Engineering Drawing Kit, Textbook"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the item, edition, condition details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Select value={condition} onValueChange={setCondition}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleCreate} className="w-full" variant="gradient">
                  List for Sale
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
              <SelectItem value="sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isOwner = item.sellerId === user?.uid;

              return (
                <div key={item.id} className={`glass-card rounded-xl overflow-hidden card-hover ${
                  item.status === 'sold' ? 'opacity-60' : ''
                }`}>
                  {/* Placeholder Image */}
                  <div className="h-40 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                    <Package className="w-16 h-16 text-muted-foreground/50" />
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-foreground line-clamp-1">{item.item}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                            item.status === 'available' 
                              ? 'bg-success/10 text-success' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {item.status}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {item.condition}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-success flex items-center">
                          <IndianRupee className="w-4 h-4" />
                          {item.price}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {item.sellerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {isOwner && item.status === 'available' && (
                      <Button
                        onClick={() => handleMarkAsSold(item.id)}
                        variant="success"
                        className="w-full"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark as Sold
                      </Button>
                    )}

                    {!isOwner && item.status === 'available' && (
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => toast.info(`Contact ${item.sellerName} to purchase`)}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Contact Seller
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-xl">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">
              List your items to start selling!
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
