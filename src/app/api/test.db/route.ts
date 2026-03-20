import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { error } = await supabaseAdmin
      .from('_test')
      .select('*')
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: '✅ Supabase connected!' 
    });
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      error: String(err) 
    }, { status: 500 });
  }
}