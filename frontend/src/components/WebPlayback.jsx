import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";

import { RiSkipForwardFill } from "react-icons/ri";
import { GiPauseButton } from "react-icons/gi";
import { FaPlay, FaPause } from "react-icons/fa";
import useGet from "./../util/useGet";
import axios from "axios";
import { AppContext } from "../AppContextProvider";

const Container = styled.div`
  width: 100%;
  background-color: #0a031c;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SongInfo = styled.div`
  display: flex;
  height: 100%;
  width: 15%;

  margin-top: auto;
  margin-bottom: auto;
  > img {
    margin-left: 1%;
    margin-right: 1%;
    margin-top: auto;
    margin-bottom: auto;
    width: auto;
    height: 85%;

    @media (max-width: 600px) {
      display: none;
    }
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
      display: none;
    }
    > h2 {
      color: white;
      font-size: 1rem;
    }

    > p {
      color: white;
      font-size: 0.8rem;
    }
  }
`;

const PlayerContainer = styled.div`
  display: flex;
  margin-top: auto;
  margin-bottom: auto;
  text-align: center;
  align-items: center;
  width: 70%;
  /* border: 1px yellow dashed; */
  justify-content: center;

  > button {
    cursor: pointer;
    background-color: transparent;
    color: white;
    border-style: hidden;
    font-size: 2rem;
  }
`;

const ExtraContainer = styled.div`
  width: 15%;
`;

const SongContainer = styled.div`
  /* border: dashed red 1px; */
  display: flex;
  width: 100%;
  height: 100%;
`;
const MobileContainer = styled.div`
  display: none;
  /* border: dashed green 1px; */
  height: 50%;
  width: 100%;

  margin-top: auto;
  margin-bottom: auto;
  @media (max-width: 600px) {
    display: flex;
  }

  > div {
    display: flex;
    padding-left: 2%;
    padding-top: 2%;
    width: 60%;
    > img {
      margin-left: 1%;
      margin-right: 1%;
      margin-top: auto;
      margin-bottom: auto;
      width: auto;
      height: 100%;
    }

    > div {
      display: flex;

      margin-left: 5%;
      margin-right: 5%;
      width: 100%;
      margin-top: auto;
      margin-bottom: auto;
      gap: 0.5rem;
      > h2 {
        color: white;
        font-size: 0.6rem;
        margin-top: auto;
        margin-bottom: auto;
      }

      > p {
        margin-top: auto;
        margin-bottom: auto;

        color: white;
        font-size: 0.5rem;
      }
    }
  }
`;

const track = {
  name: "",
  album: {
    images: [
      {
        url: "",
      },
    ],
  },
  artists: [{ name: "" }],
};

export function WebPlayback(props) {
  const context = useContext(AppContext);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const [player, setPlayer] = useState(undefined);
  const [current_track, setTrack] = useState(track);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "AudioCloud",
        getOAuthToken: (cb) => {
          cb(context.token);
        },
        volume: 0.1,
      });
      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        axios.post("https://localhost:7206/api/Host/TransferPlayback", {
          deviceIds: [device_id],
          roomCode: context.roomCode,
        });
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);
        console.log(state.paused);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
    };
  }, []);

  if (!is_active) {
    return (
      <div>
        <b>
          {" "}
          Instance not active. Transfer your playback using your Spotify app{" "}
        </b>
      </div>
    );
  } else {
    return (
      <Container>
        <MobileContainer>
          <div>
            <img src={current_track.album.images[0].url} alt="" />
            <div>
              <h2>{current_track.name}</h2>
              <p>{current_track.artists[0].name}</p>
            </div>
          </div>
        </MobileContainer>
        <SongContainer>
          <SongInfo>
            <img src={current_track.album.images[0].url} alt="" />
            <div>
              <h2>{current_track.name}</h2>
              <p>{current_track.artists[0].name}</p>
            </div>
          </SongInfo>

          <PlayerContainer>
            <button
              onClick={() => {
                player.togglePlay();
              }}
            >
              {is_paused ? <FaPlay /> : <GiPauseButton />}
            </button>

            <button
              onClick={() => {
                player.nextTrack();
              }}
            >
              <RiSkipForwardFill />
            </button>
          </PlayerContainer>
          <ExtraContainer></ExtraContainer>
        </SongContainer>
      </Container>
    );
  }
}
