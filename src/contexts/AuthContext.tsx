import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'student' | 'faculty';

export interface User {
  uid: string;
  name: string;
  email: string;
  college: string;
  role: UserRole;
  department: string;
  branch: string;
  year?: string;
  createdAt: string;
  profileComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const validateCollegeEmail = (email: string): boolean => {
  const validDomains = ['.edu', '.edu.in', '.ac.in'];
  return validDomains.some(domain => email.toLowerCase().endsWith(domain));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('uniconnect_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!validateCollegeEmail(email)) {
      return { success: false, error: 'Please use a valid college email (.edu, .edu.in, .ac.in)' };
    }

    // Check if user exists in mock storage
    const users = JSON.parse(localStorage.getItem('uniconnect_users') || '[]');
    const existingUser = users.find((u: User & { password: string }) => u.email === email);

    if (!existingUser) {
      return { success: false, error: 'User not found. Please sign up first.' };
    }

    if (existingUser.password !== password) {
      return { success: false, error: 'Invalid password.' };
    }

    const { password: _, ...userWithoutPassword } = existingUser;
    setUser(userWithoutPassword);
    localStorage.setItem('uniconnect_user', JSON.stringify(userWithoutPassword));
    return { success: true };
  };

  const signup = async (email: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> => {
    if (!validateCollegeEmail(email)) {
      return { success: false, error: 'Please use a valid college email (.edu, .edu.in, .ac.in)' };
    }

    const users = JSON.parse(localStorage.getItem('uniconnect_users') || '[]');
    const existingUser = users.find((u: User) => u.email === email);

    if (existingUser) {
      return { success: false, error: 'User already exists. Please login.' };
    }

    const newUser: User & { password: string } = {
      uid: crypto.randomUUID(),
      email,
      password,
      role,
      name: '',
      college: '',
      department: '',
      branch: '',
      year: role === 'student' ? '' : undefined,
      createdAt: new Date().toISOString(),
      profileComplete: false,
    };

    users.push(newUser);
    localStorage.setItem('uniconnect_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('uniconnect_user', JSON.stringify(userWithoutPassword));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('uniconnect_user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data, profileComplete: true };
    setUser(updatedUser);
    localStorage.setItem('uniconnect_user', JSON.stringify(updatedUser));

    // Update in users array
    const users = JSON.parse(localStorage.getItem('uniconnect_users') || '[]');
    const userIndex = users.findIndex((u: User) => u.uid === user.uid);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...data, profileComplete: true };
      localStorage.setItem('uniconnect_users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
