'use client'
import { createBrowserSupabase } from '../../../lib/supabase/browser'

export default function SignOutButton() {
  const handleSignOut = async () => {
    const supabase = createBrowserSupabase()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return <button onClick={handleSignOut}>Sign out</button>
}
