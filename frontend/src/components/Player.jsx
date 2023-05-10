import { useState, useEffect } from "react";
import styled from "styled-components";
import SpotifyPlayer from "react-spotify-web-playback";

export function Player({ accessToken, trackUris }) {
  const [play, setPlay] = useState(false);

  useEffect(() => setPlay(true), trackUris);

  return (
    <SpotifyPlayer
      token={accessToken}
      //   showSaveIcon
      callback={(state) => {
        if (!state.isPlaying) {
          setPlay(false);
        }
        console.log(state.progressMs);
      }}
      play={play}
      uris={trackUris ? trackUris : []}
      styles={{
        activeColor: "#fff",
        bgColor: "#0a031c",
        color: "#fff",
        loaderColor: "#fff",
        sliderColor: "#1cb954",
        trackArtistColor: "#ccc",
        trackNameColor: "#fff",
        // height: 40,
      }}
    />
  );
}
