import React from 'react';
import produce from 'immer';
import { createStore } from 'redux';

const initialState = {
    currentLocation: {
        Key: "215854",
        LocalizedName: "Tel Aviv"
    },
    keyAPI: "G4is8BO5IJL08uy590feWkft4iDrmzel",
    arrFavorites: []
}

const reducer = produce((state, action) => {
    switch (action.type) {
        case 'SET_KEY':
            state.currentLocation.Key = action.payload
            break
        case 'SET_LOCALIZED_NAME':
            state.currentLocation.LocalizedName = action.payload
            break
        case 'ADD_FAVORITE_CITY':
            state.arrFavorites.push(action.payload)
            break
        case 'EMPTY_FAVORITES':
            state.arrFavorites = []
            break
        default:
            break;
    }
}, initialState)

const store = createStore(reducer);
window.store = store;
export default store;