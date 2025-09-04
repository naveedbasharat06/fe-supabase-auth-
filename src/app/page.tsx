import Image from "next/image";
import supabase from "../../lib/supabaseClient";
// import SupaTasks from "./components/SupaTasks";
import NavBar from "./components/Navbar";
// import Auth from "./components/Auth"



export default function Home() {

  console.log(supabase)
    

  return (
    <div>
     
      <NavBar />
     {/* <SupaTasks />
     <Auth/> */}
    </div>
  );
}
