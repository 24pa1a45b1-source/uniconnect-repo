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
  AlertTriangle, 
  Clock, 
  User,
  MapPin,
  Flame,
  Heart,
  Shield,
  AlertCircle,
  Bell
} from 'lucide-react';

const emergencyTypes = [
  { value: 'fire', label: 'Fire Emergency', icon: Flame, color: 'text-orange-500' },
  { value: 'medical', label: 'Medical Emergency', icon: Heart, color: 'text-red-500' },
  { value: 'security', label: 'Security Issue', icon: Shield, color: 'text-blue-500' },
  { value: 'other', label: 'Other Emergency', icon: AlertCircle, color: 'text-yellow-500' },
];

export default function Emergency() {
  const { user } = useAuth();
  const { emergencies, addEmergency } = useData();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Create emergency state
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<'fire' | 'medical' | 'security' | 'other' | ''>('');

  const handleCreate = () => {
    if (!message.trim() || !location.trim() || !type) {
      toast.error('Please fill all required fields');
      return;
    }

    addEmergency({
      message: message.trim(),
      location: location.trim(),
      type,
    });

    toast.success('Emergency alert sent!', {
      description: 'Nearby users have been notified',
    });
    setIsCreateOpen(false);
    setMessage('');
    setLocation('');
    setType('');
  };

  const getTypeInfo = (emergencyType: string) => {
    return emergencyTypes.find(t => t.value === emergencyType) || emergencyTypes[3];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Warning Banner */}
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-destructive">Emergency Alerts</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Use this feature only for genuine emergencies. False alerts may result in account suspension.
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Emergency Alerts</h1>
            <p className="text-muted-foreground">
              Report emergencies and alert nearby users immediately
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="emergency" size="lg">
                <Bell className="w-4 h-4" />
                Send Emergency Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Report Emergency
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Emergency Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {emergencyTypes.map((et) => (
                      <button
                        key={et.value}
                        type="button"
                        onClick={() => setType(et.value as typeof type)}
                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                          type === et.value
                            ? 'border-destructive bg-destructive/10'
                            : 'border-border hover:border-destructive/50'
                        }`}
                      >
                        <et.icon className={`w-5 h-5 ${et.color}`} />
                        <span className="text-xs font-medium">{et.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="e.g., Lab 204, Main Building, Cafeteria"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe the emergency situation..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleCreate} className="w-full" variant="destructive" size="lg">
                  <AlertTriangle className="w-4 h-4" />
                  Send Alert Now
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Emergencies */}
        {emergencies.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Alerts</h2>
            {emergencies.map((emergency) => {
              const typeInfo = getTypeInfo(emergency.type);
              const TypeIcon = typeInfo.icon;
              const isOwner = emergency.reportedBy === user?.uid;

              return (
                <div 
                  key={emergency.id} 
                  className="glass-card rounded-xl p-5 border-l-4 border-l-destructive card-hover"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0 emergency-pulse">
                      <TypeIcon className={`w-7 h-7 ${typeInfo.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                          {typeInfo.label}
                        </span>
                        {isOwner && (
                          <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                            Your Alert
                          </span>
                        )}
                      </div>
                      
                      <p className="text-lg font-medium text-foreground mb-2">
                        {emergency.message}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-destructive" />
                          {emergency.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {emergency.reporterName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(emergency.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-xl">
            <Shield className="w-12 h-12 mx-auto mb-4 text-success opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">All Clear</h3>
            <p className="text-muted-foreground">
              No active emergency alerts. Stay safe!
            </p>
          </div>
        )}

        {/* Emergency Contacts */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4">Emergency Contacts</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Fire Department</p>
                <p className="text-sm text-muted-foreground">101</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Ambulance</p>
                <p className="text-sm text-muted-foreground">108</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-foreground">Campus Security</p>
                <p className="text-sm text-muted-foreground">+91 XXXX XXXX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
