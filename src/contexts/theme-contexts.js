import {createContext} from 'react'

export const themes = {
    light: {
        color: 'black',
        backgroundColor: 'white'
    },
    dark: {
        color: 'white',
        backgroundColor: 'black'
    }
}

export const ThemeContexts = createContext(themes.light)