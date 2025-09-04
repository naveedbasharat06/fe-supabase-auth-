"use client";
import {
  Box,
  List,
  ListItemText,
  ListItem,
  IconButton,
  Button,
  Input,
  Typography,
} from "@mui/material";

import React, { useState, useEffect } from "react";
import supabase from "../../../lib/supabaseClient";

type Task = {
  id?: number;
  title: string;
  description: string;
  [key: string]: any;
};

export default function SupaTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [updatedTask, setUpdatedTask] = useState<Partial<Task>>({});
  const [input, setInput] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: input.title,
          description: input.description,
        },
      ])
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    if (data) setTasks((prev) => [...prev, ...data]); 
    setInput({ title: "", description: "" }); 
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("id", { ascending: true });

    if (error) console.log(error);
    setTasks(data ?? []);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      console.log(error);
      return;
    }
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleUpdate = async (id: number, updatedTask: Partial<Task>) => {
    const { data, error } = await supabase
      .from("tasks")
      .update(updatedTask)
      .eq("id", id)
      .select("*");

    if (error) {
      console.log(error);
      return;
    }

    if (data) setTasks(tasks.map((task) => (task.id === id ? data[0] : task)));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "85vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography mt={4} variant="h3">
        Supa Tasks
      </Typography>
      <Typography>Manage your tasks with Supabase</Typography>

      {/* Add Task Form */}
      <Box
        mt={2}
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "300px" }}
      >
        <form onSubmit={handleSubmit}>
          <Input
            value={input.title}
            name="title"
            placeholder="Add a new title here"
            onChange={handleChange}
            fullWidth
          />
          <Input
            value={input.description}
            name="description"
            placeholder="Add a new description here"
            onChange={handleChange}
            fullWidth
          />
          <Button type="submit">Add Task</Button>
        </form>
      </Box>

     
      <Box>
        {tasks.map((task) => (
          <List key={task.id}>
            <ListItem>
              <ListItemText primary={task.title} secondary={task.description} />
              <Button onClick={() => handleDelete(task.id!)}>
                Delete
              </Button>
              {/* <Button
                onClick={() =>
                  handleUpdate(task.id!, { title: "Updated Task 🚀" })
                }
              >
               Edithere
              </Button> */}
            </ListItem>
          </List>
        ))}
      </Box>
    </Box>
  );
}
