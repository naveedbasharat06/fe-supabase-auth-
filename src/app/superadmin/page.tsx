"use client";

import { useState } from "react";
import supabase from "../../lib/supabaseClient"; // make sure this points to your client
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Alert,
} from "@mui/material";

export default function SuperAdminDashboard() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("visitor");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpdateRole = async () => {
    if (!email) {
      setMessage({ type: "error", text: "Please enter a valid email" });
      return;
    }

    try {
      const { data, error } = await supabase.rpc("update_user_role_by_email", {
            p_email: email,
            p_role_name: role,
      });


      if (error) {
        console.error("Error updating role:", error);
        setMessage({ type: "error", text: `Error: ${error.message}` });
      } else {
        console.log("Role updated:", data);
        setMessage({ type: "success", text: `User role updated to ${role}` });
        setEmail("");
        setRole("visitor");
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setMessage({ type: "error", text: "Unexpected error occurred" });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Superadmin Dashboard
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="User Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FormControl fullWidth>
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            labelId="role-select-label"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="visitor">Visitor</MenuItem>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">admin</MenuItem>
            <MenuItem value="superadmin">Superadmin</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleUpdateRole}>
          Update Role
        </Button>
      </Box>
    </Container>
  );
}
