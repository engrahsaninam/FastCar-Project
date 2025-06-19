import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { languageResources } from './i18';
import { RootState } from './Store';

interface LanguageState {
    currentLanguage: string;
    availableLanguages: string[];
}

const initialState: LanguageState = {
    currentLanguage: 'en',
    availableLanguages: Object.keys(languageResources),
};

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<string>) => {
            state.currentLanguage = action.payload;
        },
    },
});

export const { setLanguage } = languageSlice.actions;
export const languageSelector = (state: RootState) => state.language;
export default languageSlice.reducer;