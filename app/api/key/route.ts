import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const apiKey = data.apiKey;

    console.log('Received API Key :', apiKey);

    const envFilePath = path.join(process.cwd(), '.env.local');
    const envContent = `OPENAI_API_KEY=${apiKey}\n`;

    fs.writeFileSync(envFilePath, envContent, { flag: 'w' });
    console.log('API Key saved in .env.local.');

    return NextResponse.json({ message: 'API Key saved' });
  } catch (error) {
    console.error('An error occured during the API Key saving proccess : ', error);
    return NextResponse.json({ error: 'Error saving API Key' }, { status: 500 });
  }
}
