import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Users, 
  CalendarDays, 
  ShoppingBag, 
  Search, 
  HelpCircle, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Briefcase,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: CalendarDays,
    title: 'Campus Events',
    description: 'Post and discover hackathons, freshers parties, flash mobs, and more.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Briefcase,
    title: 'Career Opportunities',
    description: 'Faculty posts placements, internships, and celebrates semester toppers.',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    icon: ShoppingBag,
    title: 'Marketplace',
    description: 'Buy and sell second-hand books, calculators, drafters & more.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    icon: Search,
    title: 'Lost & Found',
    description: 'Report lost items and help others find their belongings.',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    icon: HelpCircle,
    title: 'Help Requests',
    description: 'Ask for help or assist fellow students with their needs.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
  },
  {
    icon: AlertTriangle,
    title: 'Emergency Alerts',
    description: 'Send urgent alerts to nearby users in case of emergencies.',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
];

const stats = [
  { value: '10K+', label: 'Students' },
  { value: '500+', label: 'Events' },
  { value: '1000+', label: 'Items Listed' },
  { value: '50+', label: 'Colleges' },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-2xl font-bold gradient-text">UniConnect</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/auth">Login</Link>
            </Button>
            <Button variant="gradient" asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Your Campus, Connected
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              The Ultimate{' '}
              <span className="gradient-text">Campus Platform</span>{' '}
              for Students & Faculty
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Discover events, find opportunities, trade items, and connect with your campus community — all in one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="xl" variant="gradient" asChild>
                <Link to="/auth" className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  I'm a Student
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link to="/auth" className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  I'm Faculty
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need, <span className="gradient-text">One Platform</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From campus events to emergency alerts, UniConnect brings your entire college experience together.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="glass-card rounded-2xl p-6 card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Connect Your Campus?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Join thousands of students and faculty members already using UniConnect to stay connected.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="xl" variant="gradient" asChild>
                  <Link to="/auth" className="flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Free to use
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  No credit card
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  College email only
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold gradient-text">UniConnect</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 UniConnect. Made for students, by students.
          </p>
        </div>
      </footer>
    </div>
  );
}
