import { SET } from "../action/ThemeAction";

export const myThemeReducer = (state, action) => {
  switch (action.type) {
    case SET:
      let newThemecolorstate = { ...state }
      newThemecolorstate.value.bgcolor = action.payload.bgcolor
      newThemecolorstate.value.txtcolor = action.payload.txtcolor
      return newThemecolorstate
      break
    default:
      return state
  }
}

