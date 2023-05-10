import styled from "styled-components";
import { useState } from "react";
import { Container, Form } from "react-bootstrap";
import SongResult from "./SongResult";

const DashboardContainer = styled.div`
  height: 72%;
  width: 94%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;

  /* border: dashed red 1px; */
  background-color: #0a031c;
  border-radius: 20px 20px 0px 0px;

  @media (max-width: 600px) {
    height: 70%;
  }

  h1 {
    margin-left: 4%;

    @media (max-width: 600px) {
      font-size: 1.2rem;
    }
  }
`;

const QueueContainer = styled.div`
  /* border: dashed green 1px; */
  background-color: #0a031c;
  height: 100%;
  max-width: 94%;
  width: 100%;
  margin: auto;
  overflow-y: auto;
`;

const SongsContainer = styled.div`
  /* justify-content: center;
  border: dashed red 1px; */
  /* height: 80%;
  max-height: 80%; */
  /* overflow-y: auto; */
  flex-grow: 1;
`;

const SongInfo = styled.div`
  border: dashed red 1px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 10%;
  margin-right: 5%;
`;

export function Queue(props) {
  // const [search, setSearch] = useState("");

  return (
    <DashboardContainer>
      <h1>Queue</h1>
      {/* <SongInfo>
        <div>Title</div>
        <div>Artist</div>
        <div>Duration</div>
        <div>Like</div>
      </SongInfo> */}
      <QueueContainer>
        <SongsContainer>
          {props.searchResults.map((song) => (
            <SongResult song={song} upvoteSong={props.upvoteSong} downvoteSong={props.downvoteSong} key={song.spotifyCode} />
          ))}
        </SongsContainer>
      </QueueContainer>
    </DashboardContainer>
  );
}
