import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: linear-gradient(150deg, #420119, #0b0d41);
`

const Loader = styled.div`
    @keyframes spinner {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    width: 50px;
    height: 50px;
    border: 10px solid #f3f3f3; /* Light grey */
    border-top: 10px solid #383636; /* Black */
    border-radius: 50%;
    animation: spinner 1.5s linear infinite;
`

export default function loader() {
    return (
        <Container>
            <Loader></Loader>
        </Container>
    )
}
