import React, { createContext, useContext, useEffect, useState } from 'react';

export interface LocalUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isLocal: true;
}

export type AppUser = LocalUser;

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  loginLocal: (email: string, pass: string) => void;
  registerLocal: (email: string, pass: string) => void;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginLocal: () => {},
  registerLocal: () => {},
  updateUserProfile: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for local user first
    const savedLocalUser = localStorage.getItem('gemini_clone_local_user');
    if (savedLocalUser) {
      try {
        setUser(JSON.parse(savedLocalUser));
      } catch (e) {
        // ignore
      }
    }
    setLoading(false);
  }, []);

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!user) return;
    
    if ('isLocal' in user) {
      const updatedUser: LocalUser = { ...user, displayName, photoURL };
      setUser(updatedUser);
      localStorage.setItem('gemini_clone_local_user', JSON.stringify(updatedUser));
    }
  };

  const registerLocal = (email: string, pass: string) => {
    const existingAccountsStr = localStorage.getItem('gemini_clone_local_accounts') || '{}';
    const existingAccounts = JSON.parse(existingAccountsStr);
    
    if (existingAccounts[email]) {
      throw new Error("An account with this ID or email already exists!");
    }
    
    // Save account
    existingAccounts[email] = pass;
    localStorage.setItem('gemini_clone_local_accounts', JSON.stringify(existingAccounts));
    
    // Auto log in after register
    loginLocal(email, pass);
  };

  const loginLocal = (email: string, pass: string) => {
    const existingAccountsStr = localStorage.getItem('gemini_clone_local_accounts') || '{}';
    const existingAccounts = JSON.parse(existingAccountsStr);
    
    if (existingAccounts[email] && existingAccounts[email] === pass) {
      const newUser: LocalUser = { uid: `local_${email}`, email, isLocal: true };
      setUser(newUser);
      localStorage.setItem('gemini_clone_local_user', JSON.stringify(newUser));
    } else {
      throw new Error("Invalid ID or Password! Please check your credentials.");
    }
  };

  const logout = async () => {
    localStorage.removeItem('gemini_clone_local_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginLocal, registerLocal, updateUserProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
