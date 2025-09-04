"use client";

import { useState } from "react";
import supabase from "../../../lib/supabaseClient";

// ✅ MUI Components
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
} from "@mui/material";

export default function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignIn) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Error while SignIn: ", error.message);
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error("Error while SignUp: ", error.message);
      }
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      px={2}
    >
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: "100%", maxWidth: 400 }}>
        <Typography variant="h5" align="center" fontWeight="bold" mb={3}>
          {isSignIn ? "Sign In" : "Sign Up"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.2, borderRadius: 2 }}
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <Typography align="center" mt={3}>
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link
            component="button"
            underline="hover"
            onClick={() => {
              setIsSignIn(!isSignIn);
              setEmail("");
              setPassword("");
            }}
            sx={{ fontWeight: "bold" }}
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
