import { createContext, useReducer } from "react";
import { SET } from '../action/ThemeAction'
import { myThemeReducer } from '../reducer/ThemeReducer'

export const ThemeContext = createContext()

const ThemContextProvider = (props) => {

    const [state, dispatch] = useReducer(myThemeReducer, { value: { bgcolor: 'white', txtcolor: 'black' } })

    const toggleTheme = (bgcolor, txtcolor ) => {
        dispatch({ type: SET, payload: {bgcolor : bgcolor, txtcolor : txtcolor } })
    }


    return (
        <ThemeContext.Provider
            value={{ state, toggleTheme }}
        >
            {props.children}
        </ThemeContext.Provider>
    )
}

export default ThemContextProvider