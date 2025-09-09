"use client";

import AllProduct from "../components/AllProduct"
import NewProduct from "../components/NewProduct"
import { ProtectedRoute } from '../components/ProtectedRoute';

import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { useAuth } from "../context/AuthContext";


type Props = {}

export default function page({}: Props) {
 const { user, signOut } = useAuth();
 
   return (
     <ProtectedRoute requiredRole="superadmin">
       <Container maxWidth="lg">
         <Box sx={{ py: 4 }}>
           <Paper sx={{ p: 4 }}>
             <Typography variant="h4" gutterBottom>Superadmin Dashboard</Typography>
             <Typography variant="body1" gutterBottom>Welcome, {user?.email}</Typography>
             <Typography variant="body2" color="text.secondary" gutterBottom>Role: Superadmin - Full access</Typography>
             <Typography variant="body2" color="text.secondary">You have full administrative privileges.</Typography>
             <Box sx={{ mt: 2 }}>
               <NewProduct />
               <AllProduct />
               </Box>
             <Button variant="contained" color="error" onClick={signOut} sx={{ mt: 2 }}>Sign Out</Button>
           </Paper>
         </Box>
       </Container>
     </ProtectedRoute>
   );
}