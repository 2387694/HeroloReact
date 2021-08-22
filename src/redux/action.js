
export function setKey(key){
    return { type:'SET_KEY', payload:key}
}

export function setLocalizedName(name){
    return { type:'SET_LOCALIZED_NAME', payload:name}
}

export function addFavoriteCity(city){
    return {type: 'ADD_FAVORITE_CITY', payload:city}
}

export function emptyFavorites(){
    return {type: 'EMPTY_FAVORITES'}
}


export default {setKey, setLocalizedName, addFavoriteCity, emptyFavorites}
