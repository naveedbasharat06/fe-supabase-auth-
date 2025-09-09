"use client";
import Image from "next/image";
import supabase from "../../lib/supabaseClient";


import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

import NavBar from "./components/Navbar";
import NewProduct from "./components/NewProduct";
import AllProduct from "./components/AllProduct";




export default function Home() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  console.log(supabase)

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (role === 'superadmin') router.push('/product');
        else if (role === 'admin') router.push('/admin');
        else router.push('/visitor');
      } else {
        router.push('/login');
      }
    }
  }, [user, role, loading, router]);
    

  return (
    <div >
     
      {/* <NavBar /> */}
      {/* <NewProduct />
      <AllProduct /> */}
      <Typography variant="h1">Home</Typography>
      {/* <CircularProgress /> */}
     
    </div>
  );
}
