import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './Store';
import { setLanguage } from './Slice';

export const useLanguage = () => {
    const { i18n } = useTranslation();
    const dispatch = useDispatch();
    const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
    const availableLanguages = useSelector((state: RootState) => state.language.availableLanguages);

    const changeLanguage = async (lang: string) => {
        await i18n.changeLanguage(lang);
        dispatch(setLanguage(lang));
    };

    return {
        currentLanguage,
        availableLanguages,
        changeLanguage,
    };
}; 