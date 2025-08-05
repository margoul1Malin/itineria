import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLang, targetLang } = await request.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Texte et langue cible requis' },
        { status: 400 }
      );
    }

    // Utilisation de l'instance publique de LibreTranslate
    const LIBRETRANSLATE_URL = 'https://libretranslate.com/translate';
    
    const requestBody = {
      q: text,
      source: sourceLang || 'auto',
      target: targetLang,
      format: 'text'
    };

    const response = await fetch(LIBRETRANSLATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erreur LibreTranslate:', errorData);
      return NextResponse.json(
        { error: 'Service de traduction temporairement indisponible' },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      translatedText: data.translatedText,
      detectedLanguage: data.detectedLanguage || sourceLang
    });

  } catch (error) {
    console.error('Erreur API traduction:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 