import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    const envFilePath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envFilePath)) {
      fs.unlinkSync(envFilePath);
      console.log('.env.local file deleted');
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting .env.local: ', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
