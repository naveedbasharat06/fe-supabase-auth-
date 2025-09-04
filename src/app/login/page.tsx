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
} from "@mui/material";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
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

    const { data,error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    console.log(data.session);

    const authsession = supabase.auth.getSession();
    console.log(authsession);


    if (error) {
      setToast({ open: true, message: error.message, severity: "error" });
      return;
    }

    setToast({ open: true, message: "Login successful!", severity: "success" });
    setTimeout(() => router.push("/dashboard"), 1000);
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "#f4f6f8" }}>
      <Paper elevation={6} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth type="email" label="Email" name="email" value={form.email} onChange={handleChange} margin="normal" required />
          <TextField fullWidth type="password" label="Password" name="password" value={form.password} onChange={handleChange} margin="normal" required />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
          <Typography align="center" sx={{ mt: 2 }}>
            Don't have an account?
            <Button onClick={() => router.push("/signup")}>Signup</Button>
          </Typography>
        </form>
      </Paper>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
