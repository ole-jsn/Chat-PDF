import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const message = data.userMessage;
    if (!message) {
      console.error('No User Message received.')
      return NextResponse.json({ error: 'No User Message received' }, { status: 500 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('Can not find API Key');
      return NextResponse.json({ error: 'Can not find API Key' }, { status: 500 });
    }

    const textContent = process.env.TEXT_CONTENT;
    if (!textContent) {
      console.error('Can not find extractetd Text');
      return NextResponse.json({ error: 'Can not find extractetd Text' }, { status: 500 });
    }

    console.log('User Message: ', message);
    console.log('Provided API Key: ', apiKey)
    console.log("Provided File : ", textContent)

    try {
      const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Du bist ein hilfreicher Assistent.' },
            { role: 'user', content: `Du bist eine KI, die Benutzerfragen ausschließlich basierend auf dem Inhalt eines hochgeladenen Dokuments beantwortet. Das Dokument wurde in Text umgewandelt und wird dir als Kontext zur Verfügung gestellt. Antworte nur mit Informationen, die aus dem Dokument stammen. Falls die Frage nicht durch das Dokument beantwortet werden kann, gib an, dass diese Information nicht verfügbar ist. Achte darauf, präzise und kontextbezogen zu antworten. Wenn der User also vom Dokument spricht, dann ist damit der Text gemeint. Extrahierter Text des Dokuments: ${textContent}. Hier ist die Nachricht des Users: ${message}`},
          ],
        }),
      });

      const AI_Answer = await openAIResponse.json();

      return NextResponse.json(AI_Answer);
    } catch (error) {
      console.error('OpenAI API Call failed: ', error);
      return NextResponse.json({ error: 'OpenAI API Call failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('An error occurred when trying to obtain the data for the OpenAI API Call: ', error);
    return NextResponse.json({ error: 'An error occurred when trying to obtain the data for the OpenAI API Call' }, { status: 500 });
  }
}
