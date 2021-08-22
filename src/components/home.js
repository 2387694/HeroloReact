import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { connect } from 'react-redux'
import { setKey, setLocalizedName } from '../redux/action'
import { MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardHeader, MDBBtn, MDBInput, MDBInputGroup, MDBInputGroupText, } from 'mdb-react-ui-kit';
import { withRouter } from 'react-router-dom';


function mapStateToProps(state) {
    return {
        currentLocation: state.currentLocation,
        keyAPI: state.keyAPI
    }
}

export default connect(mapStateToProps)(
    withRouter(
        function Home(props) {

            document.title = "Home Weather"

            const { dispatch } = props
            const { history } = props
            const [fiveDayForecast, setFiveDayForecast] = useState({"Headline": { "Text": '' },"DailyForecasts":[{"Date": "", "Temperature":{ "Minimum": { "Value": '', "Unit": "" },"Maximum": { "Value": '', "Unit": "" }},"Day": { "Icon": '' },"Night": { "Icon": '' }}]})
            const [isCelsius, setIsCelsius] = useState(true)
            const [currentCityFavorite, setCurrentCityFavorite] = useState(false)
            const [searchCity, setSearchCity] = useState('')
            const [listCity, setListCity] = useState([])

            useEffect(loadWether, [props.currentLocation])

            useEffect(
                function () { 
                    const listCityServer = axios.get("https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=" + props.keyAPI + "&language&q=" + searchCity)
                    listCityServer.then((res) => {
                        setListCity(res.data)
                    }).catch(error => {
                        history.push('/notFound');
                    });
                }
                , [searchCity])



            // loading weather forecast for the next 5 days
            function loadWether(isC) {
                if (isC == undefined)
                    isC = isCelsius
                const listWeatherServer = axios.get("https://dataservice.accuweather.com/forecasts/v1/daily/5day/" + props.currentLocation.Key + "?apikey=" + props.keyAPI + "&language=en-us&metric=" + isC)
                listWeatherServer.then((res) => { 
                    setFiveDayForecast(res.data)
                }).catch(error => {  
                    history.push('/notFound');
                })

                isFavorite()
            }

            // add this city to favorites
            function addToFavorite() {
                document.cookie = props.currentLocation.LocalizedName + "=" + props.currentLocation.Key;
                setCurrentCityFavorite(true)
            }

            // remove this city from favorites
            function removeFromFavorite() {
                document.cookie = props.currentLocation.LocalizedName + "=" + "0";
                setCurrentCityFavorite(false)
            }

            // finds the same cities as in the search
            function findCites(e) {
                if (!(e.target.value[e.target.value.length - 1] <= 'Z' && e.target.value[e.target.value.length - 1] >= 'A' || e.target.value[e.target.value.length - 1] >= 'a' && e.target.value[e.target.value.length - 1] <= 'z' || e.target.value[e.target.value.length - 1] == " "))
                    setSearchCity(e.target.value.slice(0, e.target.value.length - 1))
                else (setSearchCity(e.target.value))

            }

            // city selection
            function selectCity(item) {
                setListCity([])
                setSearchCity('')
                dispatch(setKey(item.Key))
                dispatch(setLocalizedName(item.LocalizedName))
                loadWether()
            }

            // Check if the city you want to view exists in favorites
            function isFavorite() {

                let favoriteCity = document.cookie.split(";")
                if (favoriteCity == [""] || favoriteCity == undefined || favoriteCity == null) {
                    setCurrentCityFavorite(false)
                    return
                }
                for (let i = 0; i < favoriteCity.length; i++) {
                    if ((favoriteCity[i].split("="))[1] == props.currentLocation.Key) {
                        setCurrentCityFavorite(true)
                        return
                    }

                }
                setCurrentCityFavorite(false)
            }


            return <>

                <div className="container-fluid">
                    <div className="row">


                        {/* weather current  */}
                        <MDBCard shadow='0' border='warning' background='white' className='mb-3' style={{ maxWidth: '18rem', margin: "0px 10px", maxHeight: '16rem' }}>
                            <MDBCardHeader>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                </svg> {props.currentLocation.LocalizedName}
                            </MDBCardHeader>
                            <MDBCardBody>
                                <MDBCardTitle>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-thermometer-high"
                                        viewBox="0 0 16 16">
                                        <path d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V2.5a.5.5 0 0 1 1 0v8.585a1.5 1.5 0 0 1 1 1.415z" />
                                        <path d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0V2.5zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1z" />
                                    </svg>
                                    {fiveDayForecast.DailyForecasts[0].Temperature.Maximum.Value}°{fiveDayForecast.DailyForecasts[0].Temperature.Maximum.Unit}

                                    <br></br>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-thermometer-low"
                                        viewBox="0 0 16 16">
                                        <path d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V9.5a.5.5 0 0 1 1 0v1.585a1.5 1.5 0 0 1 1 1.415z" />
                                        <path d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0V2.5zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1z" />
                                    </svg>{fiveDayForecast.DailyForecasts[0].Temperature.Minimum.Value}°{fiveDayForecast.DailyForecasts[0].Temperature.Minimum.Unit}

                                </MDBCardTitle>
                                <MDBCardText>
                                    {!currentCityFavorite ? <MDBBtn outline rounded className='mx-2' color='primary' onClick={addToFavorite}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg> add to favorites</MDBBtn>
                                        : <MDBBtn outline rounded className='mx-2' color='primary' onClick={removeFromFavorite}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star" viewBox="0 0 16 16">
                                                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                                            </svg> remove from favorites</MDBBtn>}
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>

                        {/* search city */}
                        <ul className="list-group col-lg-3 col-sm-3">
                            <MDBInputGroup noWrap>
                                <MDBInputGroupText><svg xmlns="http://www.w3.org/2000/svg" style={{ color: "orange" }} width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" /></svg>
                                </MDBInputGroupText>
                                <MDBInput title='Enter English letters only' onChange={findCites} label='search city' id='form1' type='text' value={searchCity} />
                            </MDBInputGroup>

                            {listCity != [] ?
                                listCity.map((item, index) => (
                                    <button key={index} onClick={() => selectCity(item)} className="list-group-item">{item.LocalizedName}</button>
                                )
                                ) : <div></div>
                            }

                        </ul>
                    </div>


                    <h3 >{fiveDayForecast.Headline.Text}</h3>
                    {/*butten C/F */}
                    {isCelsius ? <MDBBtn outline rounded color='warning' className="col-lg-1 col-xs-3" onClick={() => { setIsCelsius(false); loadWether(false) }}>°F</MDBBtn> :
                        <MDBBtn outline rounded color='warning' className="col-lg-1 col-xs-3" onClick={() => { setIsCelsius(true); loadWether(true) }}>°C</MDBBtn>
                    }

                    <br></br><br></br>
                    {/* 5 days weather forecast */}
                    {fiveDayForecast.DailyForecasts.map((item, index) => (
                        <MDBCard key={index} shadow='0' border='primary' background='white' className='mb-3' style={{ maxWidth: '18rem', display: 'inline-block', margin: '0px 25px' }}>
                            <MDBCardHeader>{(item.Date).slice(0, 10)}</MDBCardHeader>
                            <MDBCardBody>
                                <MDBCardTitle>
                                    {/* max temperature */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        className="bi bi-thermometer-high" viewBox="0 0 16 16">
                                        <path d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V2.5a.5.5 0 0 1 1 0v8.585a1.5 1.5 0 0 1 1 1.415z" />
                                        <path d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0V2.5zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1z" />
                                    </svg>
                                    maximum: {item.Temperature.Maximum.Value}° {item.Temperature.Maximum.Unit}
                                    <br></br>
                                    {/* min temperature */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        className="bi bi-thermometer-low" viewBox="0 0 16 16">
                                        <path d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V9.5a.5.5 0 0 1 1 0v1.585a1.5 1.5 0 0 1 1 1.415z" />
                                        <path d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0V2.5zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1z" />
                                    </svg>
                                    minimum: {item.Temperature.Minimum.Value}° {item.Temperature.Minimum.Unit}
                                    <br></br>
                                </MDBCardTitle>
                                _________________
                                <MDBCardText>
                                    {/* location */}
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                        <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                    </svg> {props.currentLocation.LocalizedName}
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    )
                    )}</div>
            </>
        }))