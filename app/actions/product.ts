"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { products as staticProducts, Product } from "@/components/category/product";

export async function getProducts() {
  try {
    const { data, error } = await supabase.from('b2b_products').select('*').order('created_at', { ascending: false });
    
    if (error) {
      console.warn("DB fetch failed, falling back to static products:", error.message);
      return { success: true, data: staticProducts, isFallback: true };
    }

    return { success: true, data, isFallback: false };
  } catch (error) {
    console.warn("Unexpected error, falling back to static products:", error);
    return { success: true, data: staticProducts, isFallback: true };
  }
}

export async function addProduct(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const price = formData.get("price") as string;
    const cnyPriceStr = formData.get("cnyPrice") as string;
    const cny_price = cnyPriceStr ? parseFloat(cnyPriceStr) : null;
    const description = formData.get("description") as string;
    const itemType = formData.get('itemType') as string;
    const collection = formData.get('collection') as string;
    const imageFile = formData.get('image') as File | null;

    if (!name || !price || !itemType) {
      return { success: false, error: "필수 항목을 모두 입력해주세요." };
    }

    const categories = [itemType, collection].filter(Boolean);

    let imageUrl = "/images/collection/goldenhour/1.png"; // 기본 더미 이미지

    if (imageFile && imageFile.size > 0) {
      // 1. 파일 이름 난수화
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `product_images/${fileName}`;

      // 2. 스토리지에 업로드
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Image upload failed:", uploadError);
        return { success: false, error: "이미지 업로드에 실패했습니다. Storage 버킷 정책을 확인해주세요." };
      }

      // 3. 퍼블릭 URL 가져오기
      const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(filePath);
      imageUrl = publicUrlData.publicUrl;
    }

    // 4. 데이터베이스에 저장
    const { data, error: dbError } = await supabase.from('b2b_products').insert([{
      name,
      price: `₩${price}`, // Formatting
      cny_price,
      description,
      categories: categories,
      image: imageUrl
    }]);

    if (dbError) {
      console.error("DB Insert Error:", dbError);
      return { success: false, error: dbError.message };
    }

    revalidatePath('/category');
    revalidatePath('/membership/admin');
    revalidatePath('/', 'layout');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const cnyPriceStr = formData.get("cnyPrice") as string;
    const cny_price = cnyPriceStr ? parseFloat(cnyPriceStr) : null;
    const itemType = formData.get("itemType") as string;
    const collection = formData.get("collection") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;
    const existingImageUrl = formData.get("existingImage") as string;

    const categories = [itemType, collection].filter(Boolean);

    let imageUrl = existingImageUrl;

    // 새 이미지가 업로드된 경우
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Upload Error:", uploadError);
        return { success: false, error: uploadError.message };
      }

      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);
        
      imageUrl = publicUrlData.publicUrl;
    }

    const { data, error: dbError } = await supabase
      .from('b2b_products')
      .update({
        name,
        price: price.startsWith('₩') ? price : `₩${price}`,
        cny_price,
        categories: categories,
        description: description || "",
        image: imageUrl
      })
      .eq('id', id)
      .select();

    if (dbError) {
      console.error("DB Update Error:", dbError);
      return { success: false, error: dbError.message };
    }

    revalidatePath('/category');
    revalidatePath('/membership/admin');
    revalidatePath('/', 'layout');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function deleteProduct(id: string) {
  try {
    const { data, error: dbError } = await supabase
      .from('b2b_products')
      .delete()
      .eq('id', id)
      .select();

    if (dbError) {
      console.error("DB Delete Error:", dbError);
      return { success: false, error: dbError.message };
    }

    if (!data || data.length === 0) {
      return { success: false, error: "해당 상품을 찾을 수 없거나 삭제할 권한(RLS)이 없습니다. (id: " + id + ")" };
    }

    revalidatePath('/category');
    revalidatePath('/membership/admin');
    revalidatePath('/', 'layout');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

