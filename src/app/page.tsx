import Image from "next/image";
import supabase from "../../lib/supabaseClient";

import NavBar from "./components/Navbar";
import NewProduct from "./components/NewProduct";
import AllProduct from "./components/AllProduct";




export default function Home() {

  console.log(supabase)
    

  return (
    <div >
     
      <NavBar />
      <NewProduct />
      <AllProduct />
     
    </div>
  );
}
