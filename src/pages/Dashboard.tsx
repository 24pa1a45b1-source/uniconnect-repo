import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  CalendarDays, 
  FileText, 
  HandHeart, 
  ShoppingBag, 
  Search, 
  HelpCircle, 
  AlertTriangle,
  Megaphone,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user } = useAuth();
  const { posts, applications, borrowItems, sellItems, lostFoundItems, helpRequests, emergencies } = useData();

  const stats = [
    { 
      label: 'Active Posts', 
      value: posts.length, 
      icon: CalendarDays, 
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      href: '/dashboard/posts'
    },
    { 
      label: 'Pending Applications', 
      value: applications.filter(a => a.status === 'pending').length, 
      icon: FileText, 
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      href: '/dashboard/applications'
    },
    { 
      label: 'Items to Borrow', 
      value: borrowItems.filter(i => i.status === 'available').length, 
      icon: HandHeart, 
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      href: '/dashboard/borrow'
    },
    { 
      label: 'Marketplace Items', 
      value: sellItems.filter(i => i.status === 'available').length, 
      icon: ShoppingBag, 
      color: 'text-success',
      bgColor: 'bg-success/10',
      href: '/dashboard/marketplace'
    },
  ];

  const quickActions = [
    { label: 'Create Post', icon: CalendarDays, href: '/dashboard/posts', variant: 'default' as const },
    { label: 'Lost & Found', icon: Search, href: '/dashboard/lost-found', variant: 'outline' as const },
    { label: 'Request Help', icon: HelpCircle, href: '/dashboard/help', variant: 'outline' as const },
    { label: 'Emergency', icon: AlertTriangle, href: '/dashboard/emergency', variant: 'destructive' as const },
  ];

  const recentPosts = posts.slice(0, 3);
  const activeEmergencies = emergencies.slice(0, 2);
  const pendingHelp = helpRequests.filter(h => h.status === 'pending').slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-6 md:p-8 border border-border">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Welcome back</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Hello, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-muted-foreground max-w-xl">
              {user?.role === 'student' 
                ? "Discover campus events, connect with peers, and stay updated with the latest opportunities."
                : "Manage placements, internships, and stay connected with students."}
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.href}
              className="glass-card rounded-xl p-4 md:p-5 card-hover group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-xl p-5 md:p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Button key={action.label} variant={action.variant} asChild>
                <Link to={action.href} className="flex items-center gap-2">
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Posts */}
          <div className="glass-card rounded-xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Posts</h2>
              <Link to="/dashboard/posts" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            {recentPosts.length > 0 ? (
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CalendarDays className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-foreground truncate">{post.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                          {post.type}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No posts yet. Create your first post!</p>
              </div>
            )}
          </div>

          {/* Help Requests */}
          <div className="glass-card rounded-xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Help Needed</h2>
              <Link to="/dashboard/help" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            {pendingHelp.length > 0 ? (
              <div className="space-y-3">
                {pendingHelp.map((help) => (
                  <div key={help.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-5 h-5 text-warning" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-foreground line-clamp-2">{help.request}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">by {help.requesterName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning capitalize">
                          {help.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No pending help requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Alerts */}
        {activeEmergencies.length > 0 && (
          <div className="glass-card rounded-xl p-5 md:p-6 border-destructive/50">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h2 className="text-lg font-semibold text-foreground">Active Emergencies</h2>
            </div>
            <div className="space-y-3">
              {activeEmergencies.map((emergency) => (
                <div key={emergency.id} className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-foreground">{emergency.message}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Location: {emergency.location} • Reported by {emergency.reporterName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
