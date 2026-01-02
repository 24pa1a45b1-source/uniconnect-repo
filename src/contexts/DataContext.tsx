import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type PostType = 'hackathon' | 'freshers' | 'flashmob' | 'placement' | 'internship' | 'topper' | 'others';

export interface Post {
  id: string;
  title: string;
  description: string;
  postedBy: string;
  posterName: string;
  role: 'student' | 'faculty';
  type: PostType;
  applyEnabled: boolean;
  createdAt: string;
  college: string;
  image?: string;
}

export interface Application {
  id: string;
  postId: string;
  studentId: string;
  studentName: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  year: string;
  course: string;
  email: string;
}

export interface BorrowItem {
  id: string;
  item: string;
  description: string;
  ownerId: string;
  ownerName: string;
  borrowerId: string | null;
  borrowerName: string | null;
  price: number;
  availableFrom: string;
  availableTo: string;
  status: 'available' | 'borrowed';
  isFriendOnly: boolean;
}

export interface SellItem {
  id: string;
  item: string;
  sellerId: string;
  sellerName: string;
  price: number;
  status: 'available' | 'sold';
  description: string;
  condition: string;
  image?: string;
  createdAt: string;
}

export interface LostFoundItem {
  id: string;
  item: string;
  ownerId: string;
  ownerName: string;
  location: string;
  description: string;
  notifiedUsers: string[];
  status: 'lost' | 'found';
  reportedAt: string;
  contactEmail: string;
}

export interface HelpRequest {
  id: string;
  request: string;
  requesterId: string;
  requesterName: string;
  helpersNotified: string[];
  status: 'pending' | 'resolved';
  createdAt: string;
  category: string;
}

export interface Emergency {
  id: string;
  message: string;
  reportedBy: string;
  reporterName: string;
  notifiedUsers: string[];
  createdAt: string;
  location: string;
  type: 'fire' | 'medical' | 'security' | 'other';
}

interface DataContextType {
  posts: Post[];
  applications: Application[];
  borrowItems: BorrowItem[];
  sellItems: SellItem[];
  lostFoundItems: LostFoundItem[];
  helpRequests: HelpRequest[];
  emergencies: Emergency[];
  
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'postedBy' | 'posterName' | 'role' | 'college'>) => void;
  applyToPost: (postId: string, data: { year: string; course: string; email: string }) => void;
  updateApplicationStatus: (applicationId: string, status: 'approved' | 'rejected') => void;
  
  addBorrowItem: (item: Omit<BorrowItem, 'id' | 'ownerId' | 'ownerName' | 'borrowerId' | 'borrowerName' | 'status'>) => void;
  borrowItem: (itemId: string) => void;
  returnItem: (itemId: string) => void;
  
  addSellItem: (item: Omit<SellItem, 'id' | 'sellerId' | 'sellerName' | 'status' | 'createdAt'>) => void;
  markAsSold: (itemId: string) => void;
  
  addLostFoundItem: (item: Omit<LostFoundItem, 'id' | 'ownerId' | 'ownerName' | 'notifiedUsers' | 'reportedAt'>) => void;
  markAsFound: (itemId: string) => void;
  
  addHelpRequest: (request: Omit<HelpRequest, 'id' | 'requesterId' | 'requesterName' | 'helpersNotified' | 'status' | 'createdAt'>) => void;
  resolveHelpRequest: (requestId: string) => void;
  
  addEmergency: (emergency: Omit<Emergency, 'id' | 'reportedBy' | 'reporterName' | 'notifiedUsers' | 'createdAt'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  const [posts, setPosts] = useState<Post[]>(() => 
    JSON.parse(localStorage.getItem('uniconnect_posts') || '[]')
  );
  const [applications, setApplications] = useState<Application[]>(() => 
    JSON.parse(localStorage.getItem('uniconnect_applications') || '[]')
  );
  const [borrowItems, setBorrowItems] = useState<BorrowItem[]>(() => 
    JSON.parse(localStorage.getItem('uniconnect_borrow') || '[]')
  );
  const [sellItems, setSellItems] = useState<SellItem[]>(() => 
    JSON.parse(localStorage.getItem('uniconnect_sell') || '[]')
  );
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(() => 
    JSON.parse(localStorage.getItem('uniconnect_lostfound') || '[]')
  );
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>(() => 
    JSON.parse(localStorage.getItem('uniconnect_help') || '[]')
  );
  const [emergencies, setEmergencies] = useState<Emergency[]>(() => 
    JSON.parse(localStorage.getItem('uniconnect_emergency') || '[]')
  );

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('uniconnect_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('uniconnect_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('uniconnect_borrow', JSON.stringify(borrowItems));
  }, [borrowItems]);

  useEffect(() => {
    localStorage.setItem('uniconnect_sell', JSON.stringify(sellItems));
  }, [sellItems]);

  useEffect(() => {
    localStorage.setItem('uniconnect_lostfound', JSON.stringify(lostFoundItems));
  }, [lostFoundItems]);

  useEffect(() => {
    localStorage.setItem('uniconnect_help', JSON.stringify(helpRequests));
  }, [helpRequests]);

  useEffect(() => {
    localStorage.setItem('uniconnect_emergency', JSON.stringify(emergencies));
  }, [emergencies]);

  const addPost = (postData: Omit<Post, 'id' | 'createdAt' | 'postedBy' | 'posterName' | 'role' | 'college'>) => {
    if (!user) return;
    const newPost: Post = {
      ...postData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      postedBy: user.uid,
      posterName: user.name,
      role: user.role,
      college: user.college,
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const applyToPost = (postId: string, data: { year: string; course: string; email: string }) => {
    if (!user) return;
    const newApplication: Application = {
      id: crypto.randomUUID(),
      postId,
      studentId: user.uid,
      studentName: user.name,
      status: 'pending',
      appliedAt: new Date().toISOString(),
      ...data,
    };
    setApplications(prev => [...prev, newApplication]);
  };

  const updateApplicationStatus = (applicationId: string, status: 'approved' | 'rejected') => {
    setApplications(prev => 
      prev.map(app => app.id === applicationId ? { ...app, status } : app)
    );
  };

  const addBorrowItem = (itemData: Omit<BorrowItem, 'id' | 'ownerId' | 'ownerName' | 'borrowerId' | 'borrowerName' | 'status'>) => {
    if (!user) return;
    const newItem: BorrowItem = {
      ...itemData,
      id: crypto.randomUUID(),
      ownerId: user.uid,
      ownerName: user.name,
      borrowerId: null,
      borrowerName: null,
      status: 'available',
    };
    setBorrowItems(prev => [...prev, newItem]);
  };

  const borrowItem = (itemId: string) => {
    if (!user) return;
    setBorrowItems(prev => 
      prev.map(item => item.id === itemId 
        ? { ...item, borrowerId: user.uid, borrowerName: user.name, status: 'borrowed' as const } 
        : item
      )
    );
  };

  const returnItem = (itemId: string) => {
    setBorrowItems(prev => 
      prev.map(item => item.id === itemId 
        ? { ...item, borrowerId: null, borrowerName: null, status: 'available' as const } 
        : item
      )
    );
  };

  const addSellItem = (itemData: Omit<SellItem, 'id' | 'sellerId' | 'sellerName' | 'status' | 'createdAt'>) => {
    if (!user) return;
    const newItem: SellItem = {
      ...itemData,
      id: crypto.randomUUID(),
      sellerId: user.uid,
      sellerName: user.name,
      status: 'available',
      createdAt: new Date().toISOString(),
    };
    setSellItems(prev => [...prev, newItem]);
  };

  const markAsSold = (itemId: string) => {
    setSellItems(prev => 
      prev.map(item => item.id === itemId ? { ...item, status: 'sold' as const } : item)
    );
  };

  const addLostFoundItem = (itemData: Omit<LostFoundItem, 'id' | 'ownerId' | 'ownerName' | 'notifiedUsers' | 'reportedAt'>) => {
    if (!user) return;
    const newItem: LostFoundItem = {
      ...itemData,
      id: crypto.randomUUID(),
      ownerId: user.uid,
      ownerName: user.name,
      notifiedUsers: [],
      reportedAt: new Date().toISOString(),
    };
    setLostFoundItems(prev => [...prev, newItem]);
  };

  const markAsFound = (itemId: string) => {
    setLostFoundItems(prev => 
      prev.map(item => item.id === itemId ? { ...item, status: 'found' as const } : item)
    );
  };

  const addHelpRequest = (requestData: Omit<HelpRequest, 'id' | 'requesterId' | 'requesterName' | 'helpersNotified' | 'status' | 'createdAt'>) => {
    if (!user) return;
    const newRequest: HelpRequest = {
      ...requestData,
      id: crypto.randomUUID(),
      requesterId: user.uid,
      requesterName: user.name,
      helpersNotified: [],
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setHelpRequests(prev => [...prev, newRequest]);
  };

  const resolveHelpRequest = (requestId: string) => {
    setHelpRequests(prev => 
      prev.map(req => req.id === requestId ? { ...req, status: 'resolved' as const } : req)
    );
  };

  const addEmergency = (emergencyData: Omit<Emergency, 'id' | 'reportedBy' | 'reporterName' | 'notifiedUsers' | 'createdAt'>) => {
    if (!user) return;
    const newEmergency: Emergency = {
      ...emergencyData,
      id: crypto.randomUUID(),
      reportedBy: user.uid,
      reporterName: user.name,
      notifiedUsers: [],
      createdAt: new Date().toISOString(),
    };
    setEmergencies(prev => [newEmergency, ...prev]);
  };

  return (
    <DataContext.Provider value={{
      posts,
      applications,
      borrowItems,
      sellItems,
      lostFoundItems,
      helpRequests,
      emergencies,
      addPost,
      applyToPost,
      updateApplicationStatus,
      addBorrowItem,
      borrowItem,
      returnItem,
      addSellItem,
      markAsSold,
      addLostFoundItem,
      markAsFound,
      addHelpRequest,
      resolveHelpRequest,
      addEmergency,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
