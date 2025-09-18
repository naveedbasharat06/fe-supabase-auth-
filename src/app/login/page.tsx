"use client";

import { useState } from "react";
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
import { useDispatch } from "react-redux";
import { setUser } from "@/provider/redux/authSlice";

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
      // 1. Authenticate user
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (authError) throw new Error(authError.message);
      if (!data.user) throw new Error("No user returned");
      console.log("data user is ",data.user)
      console.log("data session is here", data.session)

      const userId = data.user.id;

      // 2. Fetch user role from Supabase view
      const { data: roleData, error: roleError } = await supabase
        .from("users_with_roles")
        .select("role_name, email")
        .eq("user_id", userId)
        .single();
        console.log(roleData, "role data is her")

      if (roleError) throw new Error(roleError.message);
      if (!roleData) throw new Error("No role assigned to this user");

      const roleName = roleData.role_name;
      console.log('rolename is her',roleName)

      // 3. Save user in Redux
      dispatch(
        setUser({
          user_id: userId,
          email: roleData.email,
          role: roleName,
        })
      );

      // 4. Redirect based on role
      if (roleName === "superadmin") {
        router.push("/superadmin");
      } else if (roleName === "admin") {
        router.push("/admin");
      } else {
        router.push("/visitor");
      }

      setToast({
        open: true,
        message: `Login successful! Redirecting to ${roleName} dashboard...`,
        severity: "success",
      });
    } catch (err: any) {
      console.error("Login error:", err.message);
      setToast({
        open: true,
        message: err.message || "Login failed. Please try again.",
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
        options: { redirectTo: `${window.location.origin}/auth/callback` },
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
