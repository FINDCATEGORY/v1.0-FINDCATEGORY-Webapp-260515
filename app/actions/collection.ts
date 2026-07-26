"use server";

import { supabase } from "@/lib/supabase";

export async function getCollections() {
  try {
    const { data, error } = await supabase
      .from("b2b_collections")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch collections:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getCollections:", error);
    return [];
  }
}

export async function addCollection(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const theme = formData.get("theme") as string;
    const imageColor = formData.get("imageColor") as string;
    const items = formData.getAll("items") as string[];
    const imageFile = formData.get("image") as File | null;

    if (!name || !theme) {
      return { success: false, error: "컬렉션 이름과 테마를 입력해주세요." };
    }

    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `collections/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, imageFile);

      if (uploadError) {
        return { success: false, error: "이미지 업로드에 실패했습니다." };
      }

      const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(filePath);
      imageUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("b2b_collections")
      .insert([
        {
          name,
          theme,
          image_color: imageColor || "bg-[#EBEBDF] text-[#4C050C]",
          target_sales: 500,
          items: items,
          image_url: imageUrl,
        },
      ])
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    // 일괄 등록된 상품 처리 로직 추가
    const productIds = formData.getAll("productIds") as string[];
    if (productIds && productIds.length > 0) {
      const exchangeRateRes = await fetch("https://api.exchangerate-api.com/v4/latest/CNY");
      let exchangeRate = 191;
      try {
        const rateData = await exchangeRateRes.json();
        if (rateData?.rates?.KRW) exchangeRate = rateData.rates.KRW;
      } catch (e) {
        console.warn("Failed to fetch exchange rate server-side, using fallback 191");
      }

      for (const pId of productIds) {
        const pItemType = formData.get(`productItemType_${pId}`) as string;
        const pName = formData.get(`productName_${pId}`) as string;
        const pCnyPriceStr = formData.get(`productCnyPrice_${pId}`) as string;
        const pImageFile = formData.get(`productImage_${pId}`) as File | null;

        if (!pItemType || !pName || !pCnyPriceStr) continue;

        const cny_price = parseFloat(pCnyPriceStr);
        const krw_price = Math.ceil(cny_price * exchangeRate * 4 / 1000) * 1000;
        
        let pImageUrl = null;
        if (pImageFile && pImageFile.size > 0) {
          const pFileExt = pImageFile.name.split('.').pop();
          const pFileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${pFileExt}`;
          const pFilePath = `product_images/${pFileName}`;

          const { error: pUploadError } = await supabase.storage
            .from('products')
            .upload(pFilePath, pImageFile);

          if (!pUploadError) {
            const { data: pUrlData } = supabase.storage.from('products').getPublicUrl(pFilePath);
            pImageUrl = pUrlData.publicUrl;
          }
        }

        await supabase.from('b2b_products').insert([{
          name: pName,
          price: `₩${krw_price.toLocaleString()}`,
          cny_price,
          description: "", // 일괄 등록 시 생략
          categories: [pItemType, name], // 컬렉션 이름 추가
          image: pImageUrl
        }]);
      }
    }

    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
