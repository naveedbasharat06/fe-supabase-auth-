"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../lib/supabaseClient";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import LoginButton from "../login/LoginButton";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
  });
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
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            lastname: form.lastname,
          }
        }
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (!data.user) {
        throw new Error("No user returned after signup");
      }

      
      await new Promise(resolve => setTimeout(resolve, 2000));

      
      const { error: updateError } = await supabase
        .from("users")
        .update({
          name: form.name,
          lastname: form.lastname
        })
        .eq("user_id", data.user.id);

      if (updateError) {
        console.warn("Could not update profile with name data:", updateError.message);
        
      }

      setToast({ 
        open: true, 
        message: "Signup successful! Please check your email to confirm your account.", 
        severity: "success" 
      });

      setTimeout(() => router.push("/login"), 3000);

    } catch (error: any) {
      console.error("Signup error:", error);
      setToast({ 
        open: true, 
        message: error.message || "An error occurred during signup", 
        severity: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="grey.100" px={2}>
      <Paper elevation={8} sx={{ p: 5, width: "100%", maxWidth: 420, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom color="primary">
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
          Sign up with email & password or continue with GitHub
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField 
            label="First Name" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            fullWidth 
            margin="normal" 
            required 
          />
          <TextField 
            label="Last Name" 
            name="lastname" 
            value={form.lastname} 
            onChange={handleChange} 
            fullWidth 
            margin="normal" 
            required 
          />
          <TextField 
            label="Email" 
            name="email" 
            type="email" 
            value={form.email} 
            onChange={handleChange} 
            fullWidth 
            margin="normal" 
            required 
          />
          <TextField 
            label="Password" 
            name="password" 
            type="password" 
            value={form.password} 
            onChange={handleChange} 
            fullWidth 
            margin="normal" 
            required 
            
          />

          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            color="primary" 
            disabled={loading}
            sx={{ mt: 3, borderRadius: 2, py: 1.3, fontWeight: 600 }}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>or</Divider>
        <Box display="flex" justifyContent="center">
          <LoginButton />
        </Box>

        <Typography align="center" sx={{ mt: 3 }}>
          Already have an account?{" "}
          <Button variant="text" color="secondary" onClick={() => router.push("/login")}>
            Login
          </Button>
        </Typography>
      </Paper>

      <Snackbar open={toast.open} autoHideDuration={6000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}