'use client'
import React from 'react'
import { createBrowserSupabase } from '../../../lib/supabase/browser'
import { Button } from '@mui/material'

import GitHubIcon from "@mui/icons-material/GitHub";


export default function LoginButton() {
  const handleSignIn = async () => {
    const supabase = createBrowserSupabase()
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
       
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    })
    
  }

  return (

<Button
  variant="contained"
  fullWidth
  startIcon={<GitHubIcon />}
  onClick={handleSignIn}
  sx={{
    borderRadius: 2,
    py: 1.2,
    mt: 2,
    fontWeight: 600,
    textTransform: "none",
    fontSize: "16px",
    bgcolor: "#24292e",
    color: "#fff",
    "&:hover": {
      bgcolor: "#000",
    },
  }}
>
  Sign in with GitHub
</Button>

  )
}
