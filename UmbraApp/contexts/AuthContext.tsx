import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
}

const testUser: User = {
  id: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User'
};

const AuthContext = createContext<AuthContextType>({
  user: testUser,
  isAuthenticated: true,
  setUser: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(testUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleSetUser = (newUser: User) => {
    setUser(newUser);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      setUser: handleSetUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 
