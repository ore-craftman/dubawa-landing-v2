# Transcription and Translation API Setup Guide

## Current Implementation

The application currently uses placeholder implementations for transcription and translation. To enable full functionality, you'll need to integrate real APIs.

## Translation API (Currently Implemented)

### LibreTranslate (Currently Active)
- **Status**: ✅ Implemented
- **URL**: `https://libretranslate.de/translate`
- **Cost**: Free (with rate limits)
- **Limitations**: May have limited support for Nigerian languages (Yoruba, Hausa, Igbo)
- **Implementation**: See `translateAudio` and `translateText` functions

**Better Alternative APIs for Nigerian Languages:**

#### 1. Google Cloud Translation API
- **Supports**: Yoruba (yo), Hausa (ha), Igbo (ig)
- **Cost**: First 500,000 characters/month free, then $20 per million characters
- **Setup**: 
  1. Create a Google Cloud project
  2. Enable Cloud Translation API
  3. Create API key
  4. Add to environment variables

```typescript
// Replace in translateAudio and translateText functions:
const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    q: textToTranslate,
    source: 'en',
    target: targetLanguage === 'yoruba' ? 'yo' : targetLanguage === 'hausa' ? 'ha' : 'ig',
  })
});
```

#### 2. Microsoft Translator API
- **Supports**: Yoruba (yo), Hausa (ha), Igbo (ig)
- **Cost**: Free tier: 2 million characters/month
- **Setup**:
  1. Create Azure account
  2. Create Translator resource
  3. Get API key and endpoint

```typescript
const response = await fetch('https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=yo', {
  method: 'POST',
  headers: {
    'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_AZURE_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify([{ text: textToTranslate }])
});
```

## Transcription API (Needs Implementation)

### Current Status
The application currently displays placeholder messages. Audio is captured and logged to console.

### Recommended APIs

#### 1. **Deepgram** (Recommended)
- **Supports**: Nigerian English, Pidgin (best for your use case)
- **Cost**: Free tier: 12,000 minutes/month
- **Setup**:
  1. Sign up at [deepgram.com](https://deepgram.com)
  2. Get API key
  3. Install SDK: `npm install @deepgram/sdk`

```typescript
import { createClient } from '@deepgram/sdk';

const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);

const transcribeAudio = async (audioBlob: Blob) => {
  try {
    const { result } = await deepgram.listen.prerecorded.transcribeFile(
      audioBlob,
      {
        model: 'nova-2',
        language: 'en-US', // Deepgram handles African accents well
      }
    );
    
    return result.results.channels[0].alternatives[0].transcript;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
};
```

#### 2. **AssemblyAI**
- **Supports**: Nigerian English accents
- **Cost**: Free tier: 5 hours/month
- **Setup**:
  1. Sign up at [assemblyai.com](https://assemblyai.com)
  2. Get API key

```typescript
const transcribeAudio = async (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append('file', audioBlob);
  
  const response = await fetch('https://api.assemblyai.com/v2/upload', {
    method: 'POST',
    headers: {
      'authorization': process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY
    },
    body: formData
  });
  
  const { upload_url } = await response.json();
  
  // Start transcription
  const transcribeResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
    method: 'POST',
    headers: {
      'authorization': process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ audio_url: upload_url })
  });
  
  const { id } = await transcribeResponse.json();
  
  // Poll for results
  let result;
  while (true) {
    const pollResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
      headers: {
        'authorization': process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY
      }
    });
    result = await pollResponse.json();
    
    if (result.status === 'completed') break;
    if (result.status === 'error') throw new Error('Transcription failed');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  return result.text;
};
```

#### 3. **Google Cloud Speech-to-Text**
- **Supports**: Advanced language models
- **Cost**: First 60 minutes free/month
- **Note**: Requires server-side implementation (API keys should not be exposed)

#### 4. **NativeAI by ICIR** (Most Relevant)
- **Supports**: Nigerian English, Ghanaian English, Pidgin
- **Website**: [nativeai.icirnigeria.org](https://nativeai.icirnigeria.org)
- **Setup**: Contact ICIR for API access

## Environment Variables

Create a `.env.local` file:

```env
# Translation API Keys
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key
# OR
NEXT_PUBLIC_AZURE_KEY=your_azure_key

# Transcription API Keys
NEXT_PUBLIC_DEEPGRAM_API_KEY=your_deepgram_key
# OR
NEXT_PUBLIC_ASSEMBLYAI_API_KEY=your_assemblyai_key
```

## Implementation Steps

1. Choose your APIs (recommended: Deepgram + Google Translate)
2. Sign up and get API keys
3. Add keys to `.env.local`
4. Update the `transcribeAudio` function with your chosen API
5. Update translation functions if using a different provider than LibreTranslate
6. Test with sample audio files
7. Deploy with environment variables set in your hosting platform

## Testing

Test with sample audio:
- Record audio in browser
- Upload sample audio file
- Verify transcription appears correctly
- Test translation to each target language
- Check error handling with invalid audio

## Notes

- For Nigerian languages, Google Translate API has the best support
- Deepgram handles African English accents excellently
- Consider rate limits when choosing free tier services
- For production, implement proper error handling and loading states
- Consider caching frequent translations to reduce API costs
