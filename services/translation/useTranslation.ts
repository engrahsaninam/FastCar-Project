import { useState, useCallback } from 'react';
import { translateText } from './translationService';

interface UseTranslationConfig {
    apiKey: string;
    region?: string;
    defaultTargetLanguage?: string;
}

export const useTranslation = ({
    apiKey,
    region = 'westeurope',
    defaultTargetLanguage = 'en'
}: UseTranslationConfig) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const translate = useCallback(async (
        text: string | string[],
        targetLanguage: string = defaultTargetLanguage
    ) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await translateText(text, targetLanguage, apiKey, region);
            setIsLoading(false);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Translation failed'));
            setIsLoading(false);
            throw err;
        }
    }, [apiKey, region, defaultTargetLanguage]);

    return {
        translate,
        isLoading,
        error
    };
};
