

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"


export async function middleware(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    }
  )
const ProtectedRoutes = ["/dashboard ","/admin"]


const role = req.cookies.get("role")?.value
console.log(role ,"role is here ")
  const url = req.nextUrl.clone()

    if (url.pathname.startsWith("/admin") && role !== "admin") {
    url.pathname = "/unauthorized"
    return NextResponse.redirect(url)
  }

    if (url.pathname.startsWith("/product") && role !== "superadmin") {
    url.pathname = "/unauthorized"
    return NextResponse.redirect(url)
  }


    if (url.pathname.startsWith("/visitor") && role !== "visitor") {
    url.pathname = "/unauthorized"
    return NextResponse.redirect(url)
  }


const {data:user, error} = await supabase.auth.getSession()
if (!user)return NextResponse.redirect(new URL("/login", req.url)) 
  console.log(user)

return NextResponse.next()
}

 

      
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|login).*)", 
  ],
}

