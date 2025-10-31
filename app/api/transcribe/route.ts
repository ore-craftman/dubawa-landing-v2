import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.DEEPGRAM_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Deepgram API key not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Initialize Deepgram client
    const deepgram = createClient(apiKey);

    // Convert file to buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Transcribe the audio
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      buffer,
      {
        model: 'nova-2',
        language: 'en',
        smart_format: true,
        punctuate: true,
        paragraphs: true,
        utterances: true,
        // Deepgram handles African English accents well, including Nigerian English
      }
    );

    if (error) {
      console.error('Deepgram error:', error);
      return NextResponse.json(
        { error: 'Transcription failed', details: error.message },
        { status: 500 }
      );
    }

    if (!result || !result.results) {
      return NextResponse.json(
        { error: 'No transcription result' },
        { status: 500 }
      );
    }

    // Extract transcript text
    const transcript = result.results.channels[0]?.alternatives[0]?.transcript || '';

    return NextResponse.json({
      transcript: transcript || 'No speech detected in the audio.',
      confidence: result.results.channels[0]?.alternatives[0]?.confidence || 0,
    });
  } catch (error: any) {
    console.error('Transcription API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

