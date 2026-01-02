import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData, PostType } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Plus, 
  CalendarDays, 
  Clock, 
  User, 
  Filter,
  Search,
  Code,
  PartyPopper,
  Music,
  Briefcase,
  GraduationCap,
  Trophy,
  MoreHorizontal,
  Send
} from 'lucide-react';

const studentPostTypes: { value: PostType; label: string; icon: React.ElementType }[] = [
  { value: 'hackathon', label: 'Hackathon', icon: Code },
  { value: 'freshers', label: 'Freshers Party', icon: PartyPopper },
  { value: 'flashmob', label: 'Flash Mob', icon: Music },
  { value: 'others', label: 'Other Event', icon: MoreHorizontal },
];

const facultyPostTypes: { value: PostType; label: string; icon: React.ElementType }[] = [
  { value: 'placement', label: 'Placement', icon: Briefcase },
  { value: 'internship', label: 'Internship', icon: GraduationCap },
  { value: 'topper', label: 'Semester Topper', icon: Trophy },
  { value: 'others', label: 'Announcement', icon: MoreHorizontal },
];

export default function Posts() {
  const { user } = useAuth();
  const { posts, addPost, applyToPost, applications } = useData();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Create post state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [postType, setPostType] = useState<PostType | ''>('');
  const [applyEnabled, setApplyEnabled] = useState(false);

  // Apply state
  const [applyYear, setApplyYear] = useState('');
  const [applyCourse, setApplyCourse] = useState('');
  const [applyEmail, setApplyEmail] = useState('');

  const postTypes = user?.role === 'student' ? studentPostTypes : facultyPostTypes;

  const filteredPosts = posts.filter(post => {
    if (filter !== 'all' && post.type !== filter) return false;
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const hasApplied = (postId: string) => {
    return applications.some(a => a.postId === postId && a.studentId === user?.uid);
  };

  const handleCreatePost = () => {
    if (!title.trim() || !description.trim() || !postType) {
      toast.error('Please fill all required fields');
      return;
    }

    addPost({
      title: title.trim(),
      description: description.trim(),
      type: postType,
      applyEnabled,
    });

    toast.success('Post created successfully!');
    setIsCreateOpen(false);
    setTitle('');
    setDescription('');
    setPostType('');
    setApplyEnabled(false);
  };

  const handleApply = () => {
    if (!applyYear || !applyCourse.trim() || !applyEmail.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (selectedPostId) {
      applyToPost(selectedPostId, {
        year: applyYear,
        course: applyCourse.trim(),
        email: applyEmail.trim(),
      });

      toast.success('Application submitted successfully!');
      setIsApplyOpen(false);
      setSelectedPostId(null);
      setApplyYear('');
      setApplyCourse('');
      setApplyEmail('');
    }
  };

  const getPostIcon = (type: PostType) => {
    const allTypes = [...studentPostTypes, ...facultyPostTypes];
    return allTypes.find(t => t.value === type)?.icon || CalendarDays;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Posts & Events</h1>
            <p className="text-muted-foreground">
              {user?.role === 'student' 
                ? 'Share campus events and discover opportunities'
                : 'Post placements, internships, and announcements'}
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="w-4 h-4" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Enter post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={postType} onValueChange={(v) => setPostType(v as PostType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select post type" />
                    </SelectTrigger>
                    <SelectContent>
                      {postTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe your post..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                  <div>
                    <p className="font-medium text-foreground">Enable Applications</p>
                    <p className="text-sm text-muted-foreground">Allow others to apply</p>
                  </div>
                  <Switch
                    checked={applyEnabled}
                    onCheckedChange={setApplyEnabled}
                  />
                </div>
                <Button onClick={handleCreatePost} className="w-full" variant="gradient">
                  Create Post
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
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {[...studentPostTypes, ...facultyPostTypes].map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPosts.map((post) => {
              const PostIcon = getPostIcon(post.type);
              const applied = hasApplied(post.id);
              
              return (
                <div key={post.id} className="glass-card rounded-xl p-5 card-hover">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <PostIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground line-clamp-1">{post.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                          {post.type}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
                          {post.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {post.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.posterName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {post.applyEnabled && user?.role === 'student' && post.postedBy !== user.uid && (
                    <Button
                      onClick={() => {
                        if (!applied) {
                          setSelectedPostId(post.id);
                          setApplyEmail(user.email);
                          setIsApplyOpen(true);
                        }
                      }}
                      variant={applied ? 'secondary' : 'default'}
                      className="w-full"
                      disabled={applied}
                    >
                      {applied ? (
                        'Applied'
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Apply Now
                        </>
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-xl">
            <CalendarDays className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No posts found</h3>
            <p className="text-muted-foreground">
              {searchQuery || filter !== 'all' 
                ? 'Try adjusting your filters'
                : 'Be the first to create a post!'}
            </p>
          </div>
        )}

        {/* Apply Dialog */}
        <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Apply to Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={applyYear} onValueChange={setApplyYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent>
                    {['1st Year', '2nd Year', '3rd Year', '4th Year', 'M.Tech 1st Year', 'M.Tech 2nd Year', 'PhD'].map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Course / Branch</Label>
                <Input
                  placeholder="e.g., CSE, ECE, Mechanical"
                  value={applyCourse}
                  onChange={(e) => setApplyCourse(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="your@email.edu.in"
                  value={applyEmail}
                  onChange={(e) => setApplyEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleApply} className="w-full" variant="gradient">
                Submit Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
