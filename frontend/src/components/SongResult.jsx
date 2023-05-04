import React from "react";

import styled from "styled-components";
export default function SongResult({ song }) {
  //   function handlePlay() {
  //     chooseTrack(track);
  //   }

  const SongContainer = styled.div`
    display: flex;
    margin: 2%;
  `;

  return (
    <SongContainer
      className="d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      //   onClick={handlePlay}
    >
      <img src={song.cover} style={{ height: "64px", width: "64px" }} />
      <div className="ml-3">
        <div>{song.name}</div>
        <div className="text-muted">{song.artist}</div>
      </div>
    </SongContainer>
  );
}
