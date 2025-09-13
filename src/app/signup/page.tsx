"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { GitHub } from "@mui/icons-material";
import supabase from "../../../lib/supabaseClient";
import { useDispatch } from "react-redux";
import { setUser } from "@/provider/redux/authSlice";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
      if (form.password !== form.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // 🔹 Supabase signup with user metadata
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            lastname: form.lastname,
            role: "visitor", // Default role
          },
        },
      });

      if (signUpError) throw new Error(signUpError.message);

      if (!data.user) {
        throw new Error("Signup failed: user not returned");
      }

      // The trigger will automatically create the profile
      // So we don't need to manually insert into the profiles table

      // 🔹 Dispatch user data to Redux
      dispatch(
        setUser({
          user_id: data.user.id,
          name: form.name,
          lastname: form.lastname,
          email: form.email,
          role: "visitor",
        })
      );

      // 🔹 Toast success
      setToast({
        open: true,
        message: "Signup successful! Please check your email for verification.",
        severity: "success",
      });

      // Redirect to login after a short delay
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: any) {
      let errorMessage = error.message || "Error during signup";
      if (error.message?.includes("User already registered")) {
        errorMessage = "This email is already registered";
      }

      setToast({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    // For GitHub OAuth, we need to handle the profile creation differently
    // You might want to create a separate trigger or handle it in the callback
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) {
      setToast({ open: true, message: error.message, severity: "error" });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="grey.100"
      my={8}
      px={2}
    >
      <Paper
        elevation={8}
        sx={{ p: 5, width: "100%", maxWidth: 420, borderRadius: 4 }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
          color="primary"
        >
          Create Account
        </Typography>

        {/* 🔹 Signup Form */}
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
            helperText="At least 6 characters"
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
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

        {/* 🔹 GitHub Login */}
        <Box display="flex" justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<GitHub />}
            onClick={handleGitHubSignIn}
            sx={{ borderRadius: 2, py: 1, px: 3 }}
          >
            Continue with GitHub
          </Button>
        </Box>

        <Typography align="center" sx={{ mt: 3 }}>
          Already have an account?{" "}
          <Button
            variant="text"
            color="secondary"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </Typography>
      </Paper>

      {/* 🔹 Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
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