"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import { GitHub } from "@mui/icons-material";
import supabase from "../../../lib/supabaseClient";
import { setSession } from "../../provider/redux/sessionSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: form.email,
          password: form.password,
        }
      );

      if (authError) throw new Error(authError.message);

      console.log(data, "supabase data is here");

      const userSession = data.session;
      const user = data.user;
      
      if (userSession && user) {
       
        dispatch(setSession(userSession));
        
        
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role, name, lastname, email")
          .eq("id", user.id) 
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw new Error("Could not fetch user profile");
        }

        console.log("profile:", profile);

        const role = profile?.role || "visitor"; 
        console.log("role:", role);

        
        Cookies.set("role", role); 
        

        

     
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "superadmin") {
          router.push("/superadmin");
        } else {
          router.push("/visitor");
        }

        setToast({
          open: true,
          message: "Login successful!",
          severity: "success",
        });
      } else {
        throw new Error("No session or user data returned");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setToast({
        open: true,
        message: err.message || "Login failed. Please check your credentials.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      setToast({
        open: true,
        message: error.message || "GitHub login failed",
        severity: "error",
      });
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
      <Paper
        elevation={6}
        sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 2 }}
      >
        <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center"  mb={3}>
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
          <Button
            variant="outlined"
            startIcon={<GitHub />}
            onClick={handleGitHubSignIn}
            sx={{ borderRadius: 2, py: 1, px: 3 }}
          >
            Continue with GitHub
          </Button>
        </Box>

        <Typography align="center" sx={{ mt: 2 }}>
          Don&apos;t have an account?{" "}
          <Button
            variant="text"
            color="primary"
            onClick={() => router.push("/signup")}
            sx={{ textTransform: "none" }}
          >
            Sign up
          </Button>
        </Typography>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}  



