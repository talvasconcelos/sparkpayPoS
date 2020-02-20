import {h, createContext} from 'preact'
import { useReducer } from 'preact/hooks'

import EN from './en.json'
import ES from './es.json'
import PT from './pt.json'

export const translations = {
    en: EN,
    es: ES,
    pt: PT,
}

const getTranslate = langCode => key => translations[langCode][key] || key

const initialState = {
    langCode: "en",
    translate: getTranslate("en"),
}

export const I18nContext = createContext(initialState)

export const I18nContextProvider = ({ children }) => {
    const reducer = (state, action) => {
        switch (action.type) {
            case "setLanguage":
                return {
                    langCode: action.payload,
                    translate: getTranslate(action.payload),
                };
            default:
                return { ...initialState };
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <I18nContext.Provider value={{ ...state, dispatch }}>
            {children}
        </I18nContext.Provider>
    )
}