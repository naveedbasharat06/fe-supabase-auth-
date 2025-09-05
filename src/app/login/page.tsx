"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../lib/supabaseClient";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import LoginButton from "../login/LoginButton";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        setToast({ open: true, message: error.message, severity: "error" });
        setLoading(false);
        return;
      }

      
      const { data: { session } } = await supabase.auth.getSession();

      console.log("Session:", session);

     
      let role = "visitor"; 
      
      if (session) {
        try {
          // Parse the JWT access token to get custom claims
          const payload = JSON.parse(atob(session.access_token.split('.')[1]));
          role = payload.user_metadata?.role || payload.role || "visitor";
        } catch (err) {
          console.error("Error parsing JWT:", err);
          
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("user_id", session.user.id)
            .single();
            
          if (profile) {
            role = profile.role;
          }
        }
      }

      console.log("User role:", role);

      
      if (role === "superadmin") {
        router.push("/superadmin");
      } else if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/visitor");
      }

      setToast({
        open: true,
        message: "Login successful!",
        severity: "success",
      });
    } catch (err: any) {
      console.error("Login error:", err);
      setToast({
        open: true,
        message: err.message || "Something went wrong during login",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f4f6f8",
        px: 2,
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" mb={3}>
          Sign in to your account
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="email"
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ mt: 2, py: 1.2 }} 
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>or</Divider>
        
        <Box display="flex" justifyContent="center" mb={2}>
          <LoginButton />
        </Box>

        <Typography align="center" sx={{ mt: 2 }}>
          Don&apos;t have an account?{" "}
          <Button 
            variant="text" 
            color="primary" 
            onClick={() => router.push("/signup")}
            sx={{ textTransform: 'none' }}
          >
            Sign up
          </Button>
        </Typography>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}