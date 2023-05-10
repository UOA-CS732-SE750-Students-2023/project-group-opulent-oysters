import React from "react";
import { FaRegHeart } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { useState, Text } from "react";

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

export default function SongResult(props) {
  const location = useLocation();
  const timeMinutes = Math.floor(props.song.songLengthMS / 60000);
  const timeSeconds = ('0'+Math.floor((props.song.songLengthMS/1000)%60)).slice(-2);

  //   function handlePlay() {
  //     chooseTrack(track);
  //   }

  const handleAddSongToQueue = (song) => {
    console.log(location.state.code);
    console.log(song.spotifyCode);
    axios
      .post(
        `https://localhost:7206/api/User/AddSong?trackId=${song.spotifyCode}&roomCode=${location.state.code}`
      )
      .then((response) => {
        console.log(response);
      });
  };

  const upvoteSong = (spotifyCode) => {
    props.upvoteSong(spotifyCode);
  }

  const addSong = (spotifyCode) => {
    console.log("HEHRHEHRE");
    props.addSong(spotifyCode);
  }

  return (
    <SongContainer
      style={{ cursor: "pointer" }}
    >
      <img src={props.song.imageUrl} style={{ height: "64px", width: "64px" }} />
      <div>
        <div>{props.song.name}</div>
        <div>{props.song.artist}</div>

        <div>{timeMinutes}:{timeSeconds}</div>
        <div>
          {!props.searchResult ?
            <FaRegHeart style={{ fontSize: "25px" }} onClick={() => upvoteSong(props.song.spotifyCode)}/> : 
            <FaRegHeart style={{ fontSize: "50px" }} onClick={() => addSong(props.song.spotifyCode)}/>
          }
        </div>
      </div>
    </SongContainer>
  );
}
