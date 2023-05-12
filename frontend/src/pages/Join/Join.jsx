import React from "react";
import { useState, useContext } from "react";
import styles from "./Join.module.css";
import PinInput from "react-pin-input";
import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { AppContext } from "../../AppContextProvider";

export default function Join() {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);
  const [roomCode, setRoomCode] = useState();
  const username = useRef();
  const authUrl = "https://accounts.spotify.com/authorize";
  const clientId = "cddea26bbe4a468bae595c6581073ec2";

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

  async function checkRoom(code) {
    axios
      .post(`${import.meta.env.VITE_URL}/api/User/CheckCode?roomCode=${code}`)
      .then((response) => {
        setRoomCode(code);
        setJoined(true);
      })
      .catch((error) => {
        var inputPin = document.getElementById(styles.pinContainer);
        inputPin.classList.add(styles.error);

        setTimeout(function () {
          inputPin.classList.remove(styles.error);
        }, 350);
      });
  }

  async function joinRoom() {
    if (username.current.value === "") {
      var inputField = document.getElementById("usernameField");
      inputField.classList.add(styles.error);

      setTimeout(function () {
        inputField.classList.remove(styles.error);
      }, 350);
    } else {
      await axios
        .post(`${import.meta.env.VITE_URL}/api/User`, {
          username: username.current.value,
        })
        .then(async (userResponse) => {
          await axios
            .post(
              `${import.meta.env.VITE_URL}/api/User/JoinRoom?id=${
                userResponse.data.id
              }&username=${userResponse.data.username}&roomCode=${roomCode}`
            )
            .then((roomResponse) => {
              const cookies = new Cookies();
              cookies.set("userId", userResponse.data.id, { path: "/" });
              context.setRoomCode(roomCode);
              navigate("/dashboard", { state: { isHost: false } });
            });
        });
    }
  }

  return (
    <div>
      <div className={styles.container}>
        <h1>Join Party</h1>

        {joined ? (
          <div className={styles["container-fields"]}>
            <input
              id="usernameField"
              placeholder="Username"
              ref={username}
            ></input>
            <button onClick={() => joinRoom()}>Submit</button>
          </div>
        ) : (
          <div className={styles["container-fields"]}>
            <div id={styles.pinContainer}>
              <PinInput
                length={6}
                initialValue=""
                autoSelect={true}
                type="numeric"
                inputMode="number"
                onComplete={(roomCode) => {
                  checkRoom(roomCode);
                }}
                regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
              />
            </div>

            <button
              className={styles["button-host"]}
              onClick={() => handleClickHost()}
            >
              Host Instead
            </button>
          </div>
        )}

        <div className={styles["container-brand"]}>
          <h2>AudioCloud</h2>

          <div className={styles["container-subbrand"]}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/991px-Spotify_icon.svg.png"
              alt="Spotify Logo"
            />
            <h3>Powered by Spotify</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
