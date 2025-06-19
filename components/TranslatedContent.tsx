import { useEffect, useState } from 'react';
import { useTranslation } from '@/services/translation/useTranslation';
import { Box, Text, Select, Spinner } from '@chakra-ui/react';

interface TranslatedContentProps {
    content: string | string[];
    apiKey: string;
}

const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'nl', name: 'Dutch' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh-Hans', name: 'Chinese (Simplified)' },
];

export const TranslatedContent: React.FC<TranslatedContentProps> = ({ content, apiKey }) => {
    const [targetLanguage, setTargetLanguage] = useState('en');
    const [translatedContent, setTranslatedContent] = useState<string | string[]>();

    const { translate, isLoading, error } = useTranslation({
        apiKey,
        defaultTargetLanguage: targetLanguage
    });

    useEffect(() => {
        const performTranslation = async () => {
            try {
                const translated = await translate(content, targetLanguage);
                setTranslatedContent(translated);
            } catch (err) {
                console.error('Translation failed:', err);
            }
        };

        performTranslation();
    }, [content, targetLanguage, translate]);

    return (
        <Box>
            <Select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                mb={4}
                maxW="200px"
            >
                {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </Select>

            {isLoading ? (
                <Spinner />
            ) : error ? (
                <Text color="red.500">Error: {error.message}</Text>
            ) : (
                <Box>
                    {Array.isArray(translatedContent) ? (
                        translatedContent.map((text, index) => (
                            <Text key={index} mb={2}>{text}</Text>
                        ))
                    ) : (
                        <Text>{translatedContent}</Text>
                    )}
                </Box>
            )}
        </Box>
    );
}; 