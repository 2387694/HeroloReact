import React from 'react'
import { MDBCarousel, MDBCarouselInner, MDBCarouselItem, MDBCarouselElement } from 'mdb-react-ui-kit'
import notFound1 from '../pic/404a.jpg'
import notFound2 from '../pic/404b.jpg'


export default function NotFound() {

    document.title = "not found weather"

    return <>
        <h1>404 not found!</h1>
        <MDBCarousel showControls fade>
            <MDBCarouselInner style={{ width: "70%", height: "70%" , marginLeft:"auto", marginRight:"auto"}}>
                <MDBCarouselItem itemId={0}>
                    <MDBCarouselElement src={notFound1} alt='...' />
                </MDBCarouselItem>
                <MDBCarouselItem itemId={1}>
                    <MDBCarouselElement src={notFound2} alt='...' />
                </MDBCarouselItem>
            </MDBCarouselInner>
        </MDBCarousel>

    </>
}