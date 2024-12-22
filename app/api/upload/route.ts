/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const data: FormData = await req.formData();
  const file = data.get('file') as File;

  if (!file || file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const pdfParser = new PDFParser();

  return new Promise((resolve) => {
    pdfParser.on('pdfParser_dataError', (err) => {
      console.error('PDF Parsing Error: ', err.parserError);
      resolve(NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 }));
    });

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      const textContent = pdfData.Pages.map((page: any) =>
        page.Texts.map((textObj: any) =>
          decodeURIComponent(textObj.R.map((r: any) => r.T).join(''))
        ).join(' ')
      ).join('\n');

      console.log('Received PDF Text:', textContent);

      const envFilePath = path.join(process.cwd(), '.env.local');
      const envContent = `TEXT_CONTENT="${textContent.replace(/\n/g, '\\n')}"\n`;

      fs.appendFileSync(envFilePath, envContent, { encoding: 'utf8' });

      resolve(NextResponse.json({ text: textContent }));
    });

    pdfParser.parseBuffer(Buffer.from(buffer));
  });
}
