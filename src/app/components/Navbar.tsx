import { AppBar, Box, List, ListItem, Toolbar, Typography } from "@mui/material"
import Link from "next/link"



type Props = {}

export default function Navbar({}: Props) {
  return (
    <AppBar   position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">My App</Typography>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>
        <List sx={{ display: "flex", flexDirection: "row", padding: 0 }}>
            <Link href={"/"} style={{ textDecoration: "none", color: "white" }}>
              <ListItem>Home</ListItem>
            </Link>
            <Link href={"/signup"} style={{ textDecoration: "none", color: "white" }}>
              <ListItem>SignUp</ListItem>
            </Link>
            <Link href={"/login"} style={{ textDecoration: "none", color: "white" }}>
              <ListItem>Login</ListItem>
            </Link>
        </List>
      </Box>
      </Toolbar>
      
    </AppBar>
  )
}