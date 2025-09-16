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

      // First, try to get the role_id for 'visitor' from the roles table
      let visitorRoleId: string | null = null;
      
      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .select("id")
        .eq("name", "user")
        .maybeSingle(); // Use maybeSingle instead of single

      if (roleError) {
        console.error("Error finding visitor role:", roleError);
        // Continue anyway - we'll handle this below
      } else if (roleData) {
        visitorRoleId = roleData.id;
      }

      // If visitor role doesn't exist, try to create it
      if (!visitorRoleId) {
        console.log("Visitor role not found, attempting to create it...");
        
        const { data: newRoleData, error: createRoleError } = await supabase
          .from("roles")
          .insert([
            { 
              name: "visitor", 
              description: "Default user role" 
            }
          ])
          .select("id")
          .single();

        if (createRoleError) {
          console.error("Error creating visitor role:", createRoleError);
          // If we can't create the role, we'll continue without it
          // and handle the role assignment later
        } else if (newRoleData) {
          visitorRoleId = newRoleData.id;
          console.log("Created visitor role with ID:", visitorRoleId);
        }
      }

      // 🔹 Supabase signup
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            lastname: form.lastname,
          },
        },
      });

      if (signUpError) throw new Error(signUpError.message);
      if (!data.user) throw new Error("Signup failed: user not returned");

      // If we have a visitor role ID, try to assign it
      if (visitorRoleId) {
        // 🔹 IMPORTANT: Wait a moment to ensure the user is committed to the database
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 🔹 Insert into user_roles with the correct role_id
        const { error: userRoleError } = await supabase
          .from("user_roles")
          .insert([
            { 
              user_id: data.user.id, 
              role_id: visitorRoleId
            }
          ]);

        if (userRoleError) {
          console.error("Role insert error:", userRoleError.message);
          
          // If the error is a foreign key violation, try again after a delay
          if (userRoleError.message.includes("violates foreign key constraint")) {
            console.log("Retrying role assignment after delay...");
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const { error: retryError } = await supabase
              .from("user_roles")
              .insert([
                { 
                  user_id: data.user.id, 
                  role_id: visitorRoleId
                }
              ]);
              
            if (retryError) {
              console.error("Could not assign role to user after retry:", retryError.message);
              // Continue without role assignment - it can be done manually later
            }
          } else {
            console.error("Could not assign role to user:", userRoleError.message);
            // Continue without role assignment
          }
        }
      } else {
        console.warn("No visitor role ID available - skipping role assignment");
      }

      // 🔹 Dispatch user data
      dispatch(
        setUser({
          user_id: data.user.id,
          name: form.name,
          lastname: form.lastname,
          email: form.email,
          user_role: "visitor", // We'll set this as the default in the UI
        })
      );

      // 🔹 Success toast
      setToast({
        open: true,
        message: "Signup successful! Please check your email for verification.",
        severity: "success",
      });

      setTimeout(() => router.push("/login"), 3000);
    } catch (error: any) {
      let errorMessage = error.message || "Error during signup";
      if (error.message?.includes("User already registered")) {
        errorMessage = "This email is already registered";
      }
      setToast({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
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