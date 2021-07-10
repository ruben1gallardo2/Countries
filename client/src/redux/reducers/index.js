const initialState = {
  countries: [],
  currentCountry: {},
  activities: []
}

export default function rootReducer(state = initialState, action) {
  switch(action.type) {
    case "GET_ALL_COUNTRIES": 
      return {
        ...state,
        countries: action.payload
      }
  }
}