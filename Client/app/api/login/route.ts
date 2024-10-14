import pool from '../../../lib/db';
import { NextResponse } from 'next/server';

type User = {
  user_id: number;
  username: string;
  password: string;
};

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    const [rows] = await pool.query<User[]>('SELECT * FROM Users WHERE username = ? AND password = ?', [username, password]);

    if (rows.length > 0) {
      // Return only the username, not the whole user object
      return NextResponse.json({ message: 'Login successful', username: rows[0].username }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error logging in', error: (error as Error).message }, { status: 500 });
  }
}
