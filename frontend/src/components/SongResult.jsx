import React from "react";
import { FaRegHeart } from "react-icons/fa";
import styled from "styled-components";
export default function SongResult(props) {
  //   function handlePlay() {
  //     chooseTrack(track);
  //   }

  const SongContainer = styled.div`
    display: flex;
    margin: 2%;
    /* border: dashed red 1px; */
    gap: 2%;
    transition: 0.1s;

    &:hover {
      transform: scale(1.005);
    }

    div {
      display: flex;
      justify-content: space-between;
      /* border: dashed green 1px; */
      width: 100%;
      gap: 5px;
      margin-top: auto;
      margin-bottom: auto;
      overflow-x: hidden;
      overflow-y: hidden;
      height: 50px;

      @media (max-width: 600px) {
        font-size: 0.7rem;
      }
    }
  `;

  const upvoteSong = (spotifyCode) => {
    props.upvoteSong(spotifyCode);
  }

  return (
    <SongContainer
      style={{ cursor: "pointer" }}
      //   onClick={handlePlay}
    >
      <img src={props.song.cover} style={{ height: "64px", width: "64px" }} />
      <div>
        <div>{props.song.name}</div>
        <div>{props.song.artist}</div>

        <div>2:56</div>
        <div>
          <FaRegHeart style={{ fontSize: "25px" }} onClick={() => upvoteSong(props.song.spotifyCode)}/>
        </div>
      </div>
    </SongContainer>
  );
}
