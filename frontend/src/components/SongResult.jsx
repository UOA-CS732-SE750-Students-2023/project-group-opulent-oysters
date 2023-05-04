import React from "react";
import { FaRegHeart } from "react-icons/fa";
import styled from "styled-components";
export default function SongResult({ song }) {
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

      margin-top: auto;
      margin-bottom: auto;

      @media (max-width: 600px) {
        font-size: 0.7rem;
      }
    }
  `;

  return (
    <SongContainer
      style={{ cursor: "pointer" }}
      //   onClick={handlePlay}
    >
      <img src={song.cover} style={{ height: "64px", width: "64px" }} />
      <div>
        <div>{song.name}</div>
        <div>{song.artist}</div>
        <div>
          <FaRegHeart style={{ fontSize: "25px" }} />
        </div>
        <div>2:56</div>
      </div>
    </SongContainer>
  );
}