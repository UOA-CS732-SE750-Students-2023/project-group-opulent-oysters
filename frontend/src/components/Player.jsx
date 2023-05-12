import { useState, useEffect } from "react";
import styled from "styled-components";
import LinearProgress from "@mui/material/LinearProgress";

const Container = styled.div`
  background-color: #0a031c;
  width: 100%;
  height: 100%;
`;

const SongContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const SongInfo = styled.div`
  display: flex;
  height: 100%;
  width: 25%;
  /* border: dashed red 1px; */
  margin-top: auto;
  margin-bottom: auto;
  @media (max-width: 600px) {
    width: 100%;
  }
  > img {
    margin-left: 1%;
    margin-right: 1%;
    margin-top: auto;
    margin-bottom: auto;
    width: auto;
    height: 85%;
  }

  > div {
    display: flex;
    flex-direction: column;
    margin-left: 5%;
    margin-right: 5%;
    width: 100%;

    margin-top: auto;
    margin-bottom: auto;
    @media (max-width: 600px) {
      /* display: none; */
    }
    > h2 {
      color: white;
      font-size: 1rem;
      margin-top: 0;
      margin-bottom: 0;
      margin-right: 0;
    }

    > p {
      color: white;
      font-size: 0.7rem;
    }
  }
`;
const current_track = {
  name: "Nike",
  album: {
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg",
      },
    ],
  },
  artists: [{ name: "Frank Ocean" }],
};
export function Player(props) {
  return (
    <Container>
      <LinearProgress variant="determinate" value={50} />
      <SongContainer>
        <SongInfo>
          <img src={current_track.album.images[0].url} alt="" />
          <div>
            <h2>{current_track.name}</h2>
            <p>{current_track.artists[0].name}</p>
          </div>
        </SongInfo>
      </SongContainer>
    </Container>
  );
}
