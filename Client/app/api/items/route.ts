import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

type Item = {
  product_id: number;
  name: string;
  price: number;
  quantity_in_stock: number;
};

export async function GET() {
  try {
    const [rows] = await pool.query<Item[]>('SELECT * FROM Inventory');
    console.log('Query result:', rows); // Log query result for debugging
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching items', error: (error as Error).message }, { status: 500 });
  }
}
