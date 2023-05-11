import React, { useEffect, useContext, useState } from "react";
import styles from "./LandingPage.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { AppContext } from "../../AppContextProvider";
import Loader from "../../components/loader";

export default function LandingPage() {
  const context = useContext(AppContext);

  const navigate = useNavigate();
  const authUrl = "https://accounts.spotify.com/authorize";
  const clientId = "cddea26bbe4a468bae595c6581073ec2";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.location.search.length > 0) {
      //If query params in URL TODO: this also needs a check if there is a user currently signed in
      handleRedirect();
    }
  }, []);

  function handleClick(path) {
    navigate(path);
  }

  async function handleRedirect() {
    let code = getCodeFromUri();
    console.log(code)
    setLoading(true);
    await createHostAndRoom(code);
  }

  async function createHostAndRoom(code) {
    await axios
      .post(`${import.meta.env.VITE_URL}/api/Host`, {
        spotifyToken: code
      })
      .then(async (hostResponse) => {
        await axios
          .post(`${import.meta.env.VITE_URL}/api/Host/CreateRoom?hostId=${hostResponse.data.id}`)
          .then((roomResponse) => {
            const cookies = new Cookies();
            cookies.set("userId", hostResponse.data.id, { path: '/' });
            context.setToken(hostResponse.data.spotifyToken);
            context.setRoomCode(roomResponse.data.code);
            navigate("/dashboard", { replace: true, state: { isHost: true } });
          })
      });
  }

  function getCodeFromUri() {
    const queryString = window.location.search;
    return queryString.length > 0
      ? new URLSearchParams(queryString).get("code")
      : null;
  }

  function handleClickHost() {
    let url = authUrl;
    url += "?client_id=" + clientId;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI("http://localhost:5173/");
    url += "&show_dialog=true";
    url +=
      "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url;
  }

  return (
    <div>
      {!loading ?
        (
          <div className={styles.container}>
            <div className={styles["container-text"]}>
              <h1>AudioCloud</h1>

              <div className={styles["container-subtext"]}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/991px-Spotify_icon.svg.png"
                  alt="Spotify Logo"
                />
                <h2>Powered by Spotify</h2>
              </div>
            </div>

            <div className={styles["container-split"]}>
              <div className={styles["container-left"]} onClick={() => handleClick("/join")} >
                <button id={styles.button} onClick={() => handleClick("/join")}>
                  Join
                </button>
              </div>

              <div className={styles["container-right"]} onClick={() => handleClickHost()}>
                <button id={styles.button} onClick={() => handleClickHost()}>
                  Host
                </button>
              </div>
            </div>
          </div>
        ) :
        (
          <Loader />
        )}
    </div >
  );
}
