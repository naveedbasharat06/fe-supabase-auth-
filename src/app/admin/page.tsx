"use client";

import Router from 'next/router';
import supabase from '../../../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

 function AdminDashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async ()=>{
    await supabase.auth.signOut();
  }

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [Router, user])
  return (
    
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
            <Typography variant="body1" gutterBottom>Welcome, {user?.email}</Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>Role: Admin - Manage products and users</Typography>
            <Button variant="contained" color="error" onClick={signOut} sx={{ mt: 2 }}>Sign Out</Button>
          </Paper>
        </Box>
      </Container>
   
  );
}
export default AdminDashboard
