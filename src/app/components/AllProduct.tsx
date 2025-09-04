"use client";
import React, { useEffect, useState } from "react";
import { deleteProduct, fetchProducts, updateProduct } from "../utlis/products";
import {
  Box,
  Button,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Card,
  TextField,
} from "@mui/material";

type Props = {};

type Product = {
  picture: string;
  id: number;
  name: string;
  price: number;
  description: string;
};

export default function AllProduct({}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
    picture: "",
  });

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data || []);
        console.log("products", data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  
  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((product) => product.id !== id)); // update UI
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

 
  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: String(product.price),
      description: product.description,
      picture: product.picture,
    });
  };

  
  const handleUpdate = async (id: number) => {
    try {
      await updateProduct(id, {
        name: editForm.name,
        price: parseFloat(editForm.price),
        description: editForm.description,
        picture: editForm.picture,
      });

      
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, ...editForm, price: parseFloat(editForm.price) }
            : p
        )
      );

      setEditingId(null); 
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Box
      sx={{
        p: 5,
        mt: 3,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 2,
      }}
    >
      {products.map((product) => (
        <Card key={product.id} sx={{ borderRadius: 3, overflow: "hidden" }}>
          {editingId === product.id ? (
            <>
             
              <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <TextField
                  label="Price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                />
                <TextField
                  label="Description"
                  value={editForm.description}
                  multiline
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                />
                <TextField
                  label="Picture URL"
                  value={editForm.picture}
                  onChange={(e) =>
                    setEditForm({ ...editForm, picture: e.target.value })
                  }
                />
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => handleUpdate(product.id)}
                  variant="contained"
                  color="success"
                  size="small"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setEditingId(null)}
                  variant="outlined"
                  color="secondary"
                  size="small"
                >
                  Cancel
                </Button>
              </CardActions>
            </>
          ) : (
            <>
              
              <CardMedia
                component="img"
                height="194"
                image={product.picture}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography color="text.secondary">
                  ${product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => handleEdit(product)} size="small">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(product.id)}
                  variant="contained"
                  color="error"
                  size="small"
                >
                  Delete
                </Button>
              </CardActions>
            </>
          )}
        </Card>
      ))}
    </Box>
  );
}
