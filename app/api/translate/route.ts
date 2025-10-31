import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Text and target language are required" },
        { status: 400 }
      );
    }

    const languageCodes: { [key: string]: string } = {
      yoruba: "yo",
      hausa: "ha",
      igbo: "ig",
    };

    const langCode = languageCodes[targetLanguage] || "yo";

    // Use MyMemory Translation API
    // It supports Yoruba, Hausa, and Igbo
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=en|${langCode}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Translation API returned ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus !== 200 || !data.responseData?.translatedText) {
      // If MyMemory fails, try LibreTranslate as fallback
      try {
        const fallbackResponse = await fetch(
          "https://libretranslate.de/translate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              q: text,
              source: "en",
              target: langCode,
              format: "text",
            }),
          }
        );

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          if (fallbackData.translatedText) {
            return NextResponse.json({
              translation: fallbackData.translatedText,
              source: "libretranslate",
            });
          }
        }
      } catch (fallbackError) {
        console.error("Fallback translation error:", fallbackError);
      }

      return NextResponse.json({
        translation: `Translation unavailable for ${targetLanguage}. The text remains in English.`,
        source: "none",
        error: true,
      });
    }

    const translatedText = data.responseData.translatedText.trim();

    return NextResponse.json({
      translation: translatedText || text,
      source: "mymemory",
      confidence: data.responseData?.match || 0,
    });
  } catch (error: any) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: "Translation failed", details: error.message },
      { status: 500 }
    );
  }
}
