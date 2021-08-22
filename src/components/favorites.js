import React, { useEffect, useState } from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardHeader, MDBCardFooter, MDBBtn } from 'mdb-react-ui-kit';
import axios from 'axios';
import { connect } from 'react-redux'
import { setKey, setLocalizedName, addFavoriteCity, emptyFavorites } from '../redux/action'
import { withRouter } from 'react-router-dom';
import empty from '../pic/blankF.jpg'


function mapStateToProps(state) {
    return {
        currentLocation: state.currentLocation,
        keyAPI: state.keyAPI,
        arrFavorites: state.arrFavorites
    }
}


export default connect(mapStateToProps)(
    withRouter(
        function Favorites(props) {

            document.title = "Favorites Weather"
            const { dispatch } = props
            const { history } = props


            // view the weather forecast for the selected city on the home page 
            function goToHome(item) {
                dispatch(setKey(item.KeyCity))
                dispatch(setLocalizedName(item.City))
                history.push('/home')
            }

            // Add to arrFavorites the favorite cities
            useEffect(() => {
                dispatch(emptyFavorites())
                let favoriteCity = document.cookie.split(';')
                for (let i = 0; i < favoriteCity.length; i++)
                    if ((favoriteCity[i].split("="))[1] != "0") {
                        const weatherCity = axios.get("http://dataservice.accuweather.com/currentconditions/v1/" + (+favoriteCity[i].split("=")[1]) + "?apikey=" + props.keyAPI + "&language=en-us&details=true")
                        weatherCity.then((res) => {   
                            res.data[0].City = favoriteCity[i].split("=")[0]
                            res.data[0].KeyCity = favoriteCity[i].split("=")[1]
                            dispatch(addFavoriteCity(res.data[0])) 
                        }).catch(error => {
                            history.push('/notFound');
                        });
                    }
            }, [])



            return <>
                {
                    // show all favoites
                    props.arrFavorites.map((i, index) => (
                        <MDBCard key={index} alignment='center' style={{ maxWidth: '22rem', display: 'inline-block', margin: '5px' }}>
                            <MDBCardHeader>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill"
                                    viewBox="0 0 16 16">
                                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                </svg>
                                {i.City}
                            </MDBCardHeader>
                            <MDBCardBody>
                                <MDBCardTitle><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-thermometer-half"
                                    viewBox="0 0 16 16">
                                    <path d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V6.5a.5.5 0 0 1 1 0v4.585a1.5 1.5 0 0 1 1 1.415z" />
                                    <path d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0V2.5zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1z" />
                                </svg>
                                    {i.Temperature.Metric.Value}° {i.Temperature.Metric.Unit}</MDBCardTitle>
                                <MDBCardText>{i.WeatherText}</MDBCardText>
                                <MDBBtn outline rounded className='mx-2' color='primary' onClick={() => goToHome(i)}>Show forecast for 5 days</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    ))
                }

                {props.arrFavorites.length == 0 ?<div>
                <h2>No favorites saved</h2>
                <img src={empty} alt="..."/></div>
                 : <p></p>}



            </>
        }))