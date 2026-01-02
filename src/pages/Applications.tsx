import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  Mail,
  GraduationCap,
  BookOpen
} from 'lucide-react';

export default function Applications() {
  const { user } = useAuth();
  const { applications, posts, updateApplicationStatus } = useData();

  // For students: show their applications
  // For faculty: show applications to their posts
  const relevantApplications = user?.role === 'student'
    ? applications.filter(a => a.studentId === user.uid)
    : applications.filter(a => {
        const post = posts.find(p => p.id === a.postId);
        return post?.postedBy === user?.uid;
      });

  const handleStatusUpdate = (applicationId: string, status: 'approved' | 'rejected') => {
    updateApplicationStatus(applicationId, status);
    toast.success(`Application ${status}!`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success/10 text-success border-success/20';
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-warning/10 text-warning border-warning/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Applications</h1>
          <p className="text-muted-foreground">
            {user?.role === 'student'
              ? 'Track your applications and their status'
              : 'Review and manage applications to your posts'}
          </p>
        </div>

        {/* Applications List */}
        {relevantApplications.length > 0 ? (
          <div className="space-y-4">
            {relevantApplications.map((application) => {
              const post = posts.find(p => p.id === application.postId);
              const StatusIcon = getStatusIcon(application.status);

              return (
                <div key={application.id} className="glass-card rounded-xl p-5 card-hover">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Left: Application Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground">
                            {post?.title || 'Unknown Post'}
                          </h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {post?.type} • Posted by {post?.posterName}
                          </p>
                          
                          {user?.role === 'faculty' && (
                            <div className="mt-3 flex flex-wrap gap-4 text-sm">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <User className="w-4 h-4" />
                                {application.studentName}
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <GraduationCap className="w-4 h-4" />
                                {application.year}
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <BookOpen className="w-4 h-4" />
                                {application.course}
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="w-4 h-4" />
                                {application.email}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Status and Actions */}
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(application.status)}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-sm font-medium capitalize">{application.status}</span>
                      </div>

                      {user?.role === 'faculty' && application.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleStatusUpdate(application.id, 'approved')}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(application.id, 'rejected')}
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span>Applied on {new Date(application.appliedAt).toLocaleDateString()}</span>
                    {user?.role === 'student' && (
                      <span>Email: {application.email}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-xl">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No applications yet</h3>
            <p className="text-muted-foreground">
              {user?.role === 'student'
                ? 'Apply to posts to see your applications here'
                : 'Applications to your posts will appear here'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
