import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { products } from '@/components/product/product';

export async function GET() {
  try {
    console.log("Starting product migration...");
    
    // Check if table exists by doing a simple select
    const { error: checkError } = await supabase.from('b2b_products').select('id').limit(1);
    
    if (checkError) {
      return NextResponse.json({ error: "Table b2b_products does not exist. Please run the SQL script first.", details: checkError }, { status: 400 });
    }

    const { data: existing, error: fetchError } = await supabase.from('b2b_products').select('id');
    if (fetchError) throw fetchError;

    if (existing && existing.length > 0) {
      return NextResponse.json({ message: "Products already migrated." }, { status: 200 });
    }

    // Insert all products
    const insertData = products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      categories: p.categories,
      description: p.description
    }));

    const { data, error } = await supabase.from('b2b_products').insert(insertData);

    if (error) {
      console.error("Migration error:", error);
      throw error;
    }

    return NextResponse.json({ message: "Successfully migrated products!", count: insertData.length }, { status: 200 });

  } catch (error: any) {
    console.error("Migration failed:", error);
    return NextResponse.json({ error: "Migration failed", details: error.message }, { status: 500 });
  }
}
