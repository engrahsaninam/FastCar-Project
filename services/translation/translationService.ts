interface TranslationResponse {
    translations: {
        text: string;
        to: string;
    }[];
}

export const translateText = async (
    text: string | string[],
    targetLanguage: string,
    apiKey: string,
    region: string = 'westeurope'
) => {
    const endpoint = 'https://api.cognitive.microsofttranslator.com';
    const route = '/translate?api-version=3.0';

    try {
        const textsToTranslate = Array.isArray(text) ? text : [text];

        const response = await fetch(`${endpoint}${route}&to=${targetLanguage}`, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': apiKey,
                'Ocp-Apim-Subscription-Region': region,
                'Content-type': 'application/json',
            },
            body: JSON.stringify(
                textsToTranslate.map(t => ({
                    text: t
                }))
            )
        });

        if (!response.ok) {
            throw new Error(`Translation failed: ${response.statusText}`);
        }

        const data: TranslationResponse[] = await response.json();

        // If input was a single string, return single translation
        if (!Array.isArray(text)) {
            return data[0].translations[0].text;
        }

        // If input was an array, return array of translations
        return data.map(item => item.translations[0].text);

    } catch (error) {
        console.error('Translation error:', error);
        throw error;
    }
}; 