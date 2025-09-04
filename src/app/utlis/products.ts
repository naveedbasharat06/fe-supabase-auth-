import supabase from "../../../lib/supabaseClient";

export const fetchProducts = async () => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const addProduct = async (product: {
  name: string;
  price: number;
  description: string;
  picture: string;
}) => {
  const { data, error } = await supabase
    .from("products")
    .insert([
      { ...product, user_id: (await supabase.auth.getUser()).data.user?.id },
    ]);
  if (error) throw error;
  return data;
};

export const updateProduct = async (id: number, updates: Partial<{
  name: string;
  price: number;
    description: string;
    picture: string;
}>) => {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id);
    if (error) throw error;
    return data;

  };

export const deleteProduct = async (id: number) => {
  const { data, error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  return data;
};
  