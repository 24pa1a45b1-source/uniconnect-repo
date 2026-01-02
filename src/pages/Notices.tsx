import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Megaphone, 
  Clock, 
  User,
  Pin,
  CalendarDays,
  Code,
  PartyPopper,
  Music,
  Briefcase,
  GraduationCap,
  Trophy,
  MoreHorizontal
} from 'lucide-react';

const postTypeIcons: Record<string, React.ElementType> = {
  hackathon: Code,
  freshers: PartyPopper,
  flashmob: Music,
  placement: Briefcase,
  internship: GraduationCap,
  topper: Trophy,
  others: MoreHorizontal,
};

const postTypeColors: Record<string, string> = {
  hackathon: 'bg-blue-500/10 text-blue-500',
  freshers: 'bg-pink-500/10 text-pink-500',
  flashmob: 'bg-purple-500/10 text-purple-500',
  placement: 'bg-green-500/10 text-green-500',
  internship: 'bg-orange-500/10 text-orange-500',
  topper: 'bg-yellow-500/10 text-yellow-500',
  others: 'bg-gray-500/10 text-gray-500',
};

export default function Notices() {
  const { posts, emergencies } = useData();

  // Combine all notices (posts + emergencies) sorted by date
  const allNotices = [
    ...posts.map(post => ({
      id: post.id,
      type: 'post' as const,
      postType: post.type,
      title: post.title,
      description: post.description,
      author: post.posterName,
      createdAt: post.createdAt,
      role: post.role,
    })),
    ...emergencies.map(emergency => ({
      id: emergency.id,
      type: 'emergency' as const,
      postType: 'emergency',
      title: emergency.message,
      description: `Location: ${emergency.location}`,
      author: emergency.reporterName,
      createdAt: emergency.createdAt,
      role: 'system',
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Megaphone className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Digital Notice Board</h1>
            <p className="text-muted-foreground">
              All campus announcements and updates in one place
            </p>
          </div>
        </div>

        {/* Notice Board */}
        {allNotices.length > 0 ? (
          <div className="space-y-4">
            {allNotices.map((notice, index) => {
              const PostIcon = notice.type === 'emergency' 
                ? Megaphone 
                : postTypeIcons[notice.postType] || CalendarDays;
              const colorClass = notice.type === 'emergency'
                ? 'bg-destructive/10 text-destructive'
                : postTypeColors[notice.postType] || 'bg-primary/10 text-primary';

              return (
                <div 
                  key={notice.id} 
                  className={`glass-card rounded-xl p-5 card-hover ${
                    notice.type === 'emergency' ? 'border-l-4 border-l-destructive' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <PostIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground line-clamp-2">
                            {notice.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${colorClass}`}>
                              {notice.type === 'emergency' ? 'URGENT' : notice.postType}
                            </span>
                            {notice.type === 'post' && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground capitalize">
                                {notice.role}
                              </span>
                            )}
                          </div>
                        </div>
                        {index < 3 && (
                          <Pin className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {notice.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {notice.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(notice.createdAt).toLocaleDateString()} at{' '}
                          {new Date(notice.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
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
            <Megaphone className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No notices yet</h3>
            <p className="text-muted-foreground">
              Check back later for updates and announcements
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
