import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { RiSkipForwardFill } from "react-icons/ri";
import { GiPauseButton } from "react-icons/gi";
import { FaPlay } from "react-icons/fa";
import LinearProgress from "@mui/material/LinearProgress";
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
  width: 25%;
  margin-top: auto;
  margin-bottom: auto;
  @media (max-width: 600px) {
    width: 35%;
  }
  @media (max-width: 1000px) {
    width: 30%;
  }
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

const PlayerContainer = styled.div`
  display: flex;
  margin-top: auto;
  margin-bottom: auto;
  text-align: center;
  align-items: center;
  width: 50%;

  justify-content: center;
  @media (max-width: 600px) {
    width: 30%;
  }
  @media (max-width: 1000px) {
    width: 40%;
  }

  > button {
    cursor: pointer;
    background-color: transparent;
    color: white;
    border-style: hidden;
    font-size: 2rem;
  }
`;

const ExtraContainer = styled.div`
  margin-top: auto;
  margin-bottom: auto;
  width: 25%;
  @media (max-width: 600px) {
    width: 35%;
  }
  @media (max-width: 1000px) {
    width: 30%;
  }
`;

const SongContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
const MobileContainer = styled.div`
  display: none;
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
    width: 70%;
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

const LoadingContainer = styled.div`
  display: flex;

  width: 10%;

  margin: auto;
`;
const LoadingEffect = styled.div`
  width: 20px;
  height: 20px;
  border: 8px solid;
  border-color: #d8d8db transparent #ffffff transparent;
  border-radius: 50%;
  animation: spin-anim 0.5s linear infinite;
  margin: auto;

  @keyframes spin-anim {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
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
  const [progress, setProgress] = useState(0);

  props.setTrack(current_track);

  function playNext(hostId, roomCode) {
    axios
      .get(
        `${
          import.meta.env.VITE_URL
        }/api/Host/NextSong?roomCode=${roomCode}&hostId=${hostId}`
      )
      .then((response) => {
        axios
          .post(
            `${
              import.meta.env.VITE_URL
            }/api/Host/PlaySong?roomCode=${roomCode}&trackId=${
              response.data.spotifyCode
            }`
          )
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }

  function skipSong(hostId, roomCode) {
    if (props.queue.length > 0) {
      playNext(hostId, roomCode);
    }
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    [];

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
        axios.post(`${import.meta.env.VITE_URL}/api/Host/TransferPlayback`, {
          deviceIds: [device_id],
          roomCode: context.roomCode,
        });
      });

      player.addListener("not_ready", ({ device_id }) => {
        
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setTrack({ ...current_track, ...state.track_window.current_track });
        setPaused(state.paused);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });

        if (!state.paused) {
          if (state.position >= state.duration - 500) {
            playNext(props.hostId, context.roomCode);
          }

          const interval = setInterval(() => {
            player.getCurrentState().then((state) => {
              if (!state) {
                console.error(
                  "User is not playing music through the Web Playback SDK"
                );
                return;
              }
              setProgress((state.position / state.duration) * 100);
              props.setSongProgress(state.duration);
              props.setLyricPosition(state.position);
            });
          }, 300);
          return () => {
            clearInterval(interval);
          };
        }
      });

      player.connect();
    };
  }, []);

  if (!is_active) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingEffect />
        </LoadingContainer>
      </Container>
    );
  } else {
    return (
      <Container>
        <div>
          <LinearProgress variant="determinate" value={progress} />
        </div>
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
                skipSong(props.hostId, context.roomCode);
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
