"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../lib/supabaseClient";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      try {
        
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
          console.error("Auth error:", authError);
          router.push("/login");
          return;
        }

        if (!user) {
          console.log("No authenticated user");
          router.push("/login");
          return;
        }

        console.log("Authenticated user:", user.id);

        
        const { data, error } = await supabase
          .from("users")
          .select("name, lastname, email, created_at")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Profile fetch error:", error);
          
         
          if (error.code === 'PGRST116') {
            const { error: createError } = await supabase
              .from("users")
              .insert({
                user_id: user.id,
                email: user.email,
                name: user.user_metadata?.name || '',
                lastname: user.user_metadata?.lastname || '',
              });

            if (createError) {
              console.error("Create profile error:", createError);
              setToast({ open: true, message: "Error creating profile", severity: "error" });
            } else {
              
              const { data: newData } = await supabase
                .from("users")
                .select("name, lastname, email, created_at")
                .eq("user_id", user.id)
                .single();
              
              setProfile(newData);
            }
          } else {
            setToast({ open: true, message: "Error loading profile", severity: "error" });
          }
        } else {
          setProfile(data);
        }

      } catch (error) {
        console.error("Unexpected error:", error);
        setToast({ open: true, message: "An unexpected error occurred", severity: "error" });
      } finally {
        setLoading(false);
      }
    };

    getProfile();

    
    const subscription = supabase
      .channel('profile-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'users' 
        }, 
        (payload) => {
          if (payload.new.user_id === profile?.user_id) {
            setProfile(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading your profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#f4f6f8", p: 2 }}>
      <Paper elevation={6} sx={{ p: 4, width: "100%", maxWidth: 500, textAlign: "center" }}>
        {profile ? (
          <>
            <Typography variant="h4" gutterBottom color="primary">
              Welcome to Dashboard
            </Typography>
            <Typography variant="h6" gutterBottom>
              Hello, {profile.name} {profile.lastname}! 🚀
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Email: {profile.email}
            </Typography>
            {profile.created_at && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Member since: {new Date(profile.created_at).toLocaleDateString()}
              </Typography>
            )}
            <Button 
              variant="contained" 
              color="error" 
              onClick={handleLogout} 
              sx={{ mt: 3 }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom color="error">
              Profile Not Found
            </Typography>
            <Typography variant="body1" gutterBottom>
              Your authentication was successful but we couldn't find your profile data.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => window.location.reload()} 
              sx={{ mt: 2, mr: 2 }}
            >
              Retry
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleLogout} 
              sx={{ mt: 2 }}
            >
              Return to Login
            </Button>
          </>
        )}
      </Paper>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}