import styled from "styled-components";
import axios from "axios";
import { useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/Ai";
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
  z-index: 0;
  @media (max-width: 600px) {
  }
`;

const Modal = styled.div`
  z-index: 10;
  position: relative;
  width: 80%;
  height: 80%;
  margin-left: auto;
  margin-right: auto;
  /* margin-top: auto;
    margin-bottom: auto; */
  top: 50%;
  background-color: #0a031c;
  opacity: 1;
  transform: translateY(-50%);
  border-radius: 40px;
`;

const CloseButton = styled.button`
  padding: 1%;
  background-color: transparent;
  color: white;
  border-style: hidden;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
  @media (max-width: 600px) {
    padding: 4%;
  }
`;

const CloseContainer = styled.div`
  width: 100%;
`;
const TVContainer = styled.div`
  margin-left: 3%;
  margin-right: 3%;
  > div {
    > h1 {
      font-size: 1.8rem;
      @media (max-width: 600px) {
        font-size: 1rem;
      }
    }
  }
`;

const SongContainer = styled.div`
  display: flex;
  flex-direction: column;

  > img {
    @media (max-width: 600px) {
    }
    height: 35%;
    width: 35%;
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

        <TVContainer>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h1>TV mode</h1> <h1>Join Code: {props.roomCode}</h1>
          </div>
          <SongContainer>
            <img
              src="https://www.graphicdesignforum.com/uploads/default/original/2X/d/d3c4e744046205a49d06beb874df3b39da7c9c73.jpeg"
              alt=""
            />
            <div>
              <h2> {props.name}</h2>
              <p> {props.artist}</p>
            </div>
          </SongContainer>
          <div>progress bar</div>
        </TVContainer>
      </Modal>
    </Container>
  );
}
