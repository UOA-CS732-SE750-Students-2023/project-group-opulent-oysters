import styled from "styled-components";
import axios from "axios";
import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/Ai";
// import { QRcode } from "../public/qr.png";
const Container = styled.div`
  /* background-color: #0a031c; */
  background-image: linear-gradient(150deg, #420119, #0b0d41);
  opacity: 1;
  margin-left: auto;
  margin-right: auto;

  width: 100%;
  height: 100%;
  position: absolute;
  top: 0%;
  color: white;

  @media (max-width: 600px) {
  }
`;

const Modal = styled.div`
  position: relative;
  width: 90%;
  height: 90%;
  margin-left: auto;
  margin-right: auto;
  /* margin-top: auto;
    margin-bottom: auto; */
  top: 50%;

  opacity: 1;
  transform: translateY(-50%);
  border-radius: 40px;
`;

const CloseButton = styled.button`
  /* padding-left: 1%;
  padding-top: 1%; */
  background-color: transparent;
  color: white;
  border-style: hidden;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
  @media (max-width: 600px) {
    /* padding-left: 5%;
    padding-top: 5%; */
  }
`;

const CloseContainer = styled.div`
  width: 100%;
`;

const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  height: 20%;
  /* border: dashed red 1px; */
  justify-content: space-between;

  @media (max-width: 800px) {
    margin-top: 5%;
  }
`;

const PartyContainer = styled.div`
  width: auto;
  /* border: dashed red 1px; */
  > h1 {
    font-size: 5rem;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 0;
    @media (max-width: 1550px) {
      font-size: 3rem;
    }
    @media (max-width: 800px) {
      font-size: 1.5rem;
    }
    @media (max-width: 600px) {
      font-size: 1.2rem;
    }
  }
  > h2 {
    font-size: 1rem;
    font-weight: 500;
    margin-left: 4%;
    margin-top: 0;
    margin-bottom: 0;
    @media (max-width: 1550px) {
      font-size: 1rem;
    }
    @media (max-width: 800px) {
      font-size: 0.8rem;
    }
    @media (max-width: 600px) {
      font-size: 0.6rem;
    }
  }
`;

const JoinContainer = styled.div`
  display: flex;
  width: 30%;

  /* border: dashed red 1px; */
  > div {
    width: 100%;
    margin-right: 5%;
    margin-left: auto;
    > h1 {
      text-align: right;
      margin-top: 0;
      margin-bottom: 0;
      font-size: 3rem;
      font-weight: 700;
      @media (max-width: 1550px) {
        font-size: 2.2rem;
      }
      @media (max-width: 800px) {
        font-size: 1.5rem;
      }
      @media (max-width: 600px) {
        font-size: 1.2rem;
      }
    }
    > h2 {
      text-align: right;
      margin-top: 0;
      margin-bottom: 0;
      font-size: 3rem;
      font-weight: 200;
      @media (max-width: 1550px) {
        font-size: 2rem;
      }
      @media (max-width: 800px) {
        font-size: 1.2rem;
      }
      @media (max-width: 600px) {
        font-size: 0.8rem;
      }
    }
  }
  img {
    width: 150px;
    height: 150px;
    border: white solid 4px;
    @media (max-width: 800px) {
      width: 30%;
      height: 30%;
      display: none;
    }
  }
`;
const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const PlayerContainer = styled.div`
  /* border: dashed red 1px; */
  margin-top: 2%;
  width: 50%;
  display: flex;
  flex-direction: column;
  @media (max-width: 1550px) {
    margin-top: 5%;
  }
  @media (max-width: 800px) {
    width: 90%;
  }
`;

const SongContainer = styled.div`
  display: flex;
  width: 100%;
  /* border: dashed green 1px; */
  > img {
    width: 40%;
  }

  > div {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 3%;
    > h2 {
      margin-top: 0;
      margin-bottom: 0;
      font-size: 2rem;
      font-weight: 500;
    }
    > p {
      margin-top: 10px;
      margin-bottom: 0;
      font-size: 1rem;
      font-weight: 300;
    }
  }
`;

const ProgressContainer = styled.div`
  margin-top: 50px;
  width: 100%;
  height: 100%;
  p {
    font-size: 0.2rem;
    background-color: white;
  }
`;

const LyricsContainer = styled.div`
  @media (max-width: 800px) {
    display: none;
  }
`;

const QRphoneMode = styled.div`
  width: 40%;
  margin-top: 15%;
  margin-left: auto;
  margin-right: auto;
  > img {
    width: 100%;
  }
  display: none;
  > p {
    text-align: center;
    font-weight: 500;
  }
  @media (max-width: 800px) {
    display: block;
  }
`;
export function TVmode(props) {
  return (
    <Container onClick={props.handleClose}>
      <Modal>
        <CloseContainer>
          <CloseButton onClick={props.handleClose}>
            <AiOutlineCloseCircle style={{ fontSize: "27px" }} />
          </CloseButton>
        </CloseContainer>

        <HeaderContainer>
          <PartyContainer>
            <h1>{props.host.name}'s Party</h1>
            <h2>{props.host.partySize} Currently listening</h2>
          </PartyContainer>

          <JoinContainer>
            <div>
              <h1>Join Code:</h1>
              <h2>{props.host.code}</h2>
            </div>
            <img src="qr.png" alt="" />
          </JoinContainer>
        </HeaderContainer>
        <BottomContainer>
          <PlayerContainer>
            <SongContainer>
              <img
                src="https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg"
                alt=""
              />

              <div>
                <h2>Nights</h2>
                <p> Frank Ocean</p>
              </div>
            </SongContainer>
            <ProgressContainer>
              <p>Bar</p>
            </ProgressContainer>
          </PlayerContainer>
          <LyricsContainer></LyricsContainer>
          <QRphoneMode>
            <img src="qr.png" alt="" />
            <p>QR Join</p>
          </QRphoneMode>
        </BottomContainer>
      </Modal>
    </Container>
  );
}
