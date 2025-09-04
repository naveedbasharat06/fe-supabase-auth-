"use client";

import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import { addProduct } from "../utlis/products";

type Props = {};

export default function NewProduct({}: Props) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    picture: "",
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addProduct({
        name: form.name,
        price: parseFloat(form.price),
        description: form.description,
        picture: form.picture,
      });

      setToast({
        open: true,
        message: "Product added successfully!",
        severity: "success",
      });

      
      setForm({ name: "", price: "", description: "", picture: "" });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        message: " Failed to add product!",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 400,
          mx: "auto",
          p: 4,
          borderRadius: 3,
          backgroundColor: "#fafafa",
          mt: 4,
        }}
      >
        <Typography
          align="center"
          variant="h5"
          sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}
        >
          Add Product
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Price"
            name="price"
            value={form.price}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />

          <TextField
            label="Picture URL"
            name="picture"
            value={form.picture}
            onChange={handleChange}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              py: 1.2,
              fontWeight: "bold",
              borderRadius: 2,
            }}
          >
            Add Product
          </Button>
        </Box>
      </Paper>

      
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
