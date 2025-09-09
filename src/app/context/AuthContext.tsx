"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import supabase from '../../../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  role: string;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'visitor',
  loading: true,
  signOut: async () => {},
  refreshAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string>('visitor');
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching role for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .single();
        // console.log(data,'data is here founded ')

      // Handle different types of errors  
      if (error) {
        console.error('Error fetching role - code:', error.code, 'message:', error.message);
        
        // Check if it's a "no rows" error (profile doesn't exist)
        if (error.code === 'PGRST116' || error.message.includes('No rows found')) {
          console.log('No profile found, creating one...');
          
          // Auto-create profile if it doesn't exist
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                user_id: userId,
                email: user?.email || '',
                name: user?.user_metadata?.name || '',
                lastname: user?.user_metadata?.lastname || '',
                role: 'visitor'
              }
            ]);

          if (insertError) {
            console.error('Error creating profile:', insertError);
            setRole('visitor');
          } else {
            // console.log('Profile created successfully');
            setRole('visitor');
          }
        } else {
          // Other database errors
          setRole('visitor');
        }
        return;
      }

      if (data) {
       
        setRole(data.role);
      } else {
        console.log('No profile data found');
        setRole('visitor');
      }
    } catch (error: any) {
      console.error('Unexpected error in fetchUserRole:', error);
      setRole('visitor');
    }
  };

  const refreshAuth = async () => {
    console.log('Refreshing auth state...');
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('Current session is here:', session);
      
      if (error) {
        console.error('Error getting session:', error);
        return;
      }

      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserRole(session.user.id);
      } else {
        setRole('visitor');
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
    }
  };

  useEffect(() => {
    let authSubscription: any;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        setUser(session?.user ?? null);

        if (session?.user) {
          console.log('User found:', session.user.email);
          await fetchUserRole(session.user.id);
        } else {
          console.log('No user session found');
          setRole('visitor');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

   
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('User logged in:', session.user.email);
          await fetchUserRole(session.user.id);
        } else {
          console.log('User logged out');
          setRole('visitor');
        }
      }
    );

    authSubscription = subscription;

    
    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signOut, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};