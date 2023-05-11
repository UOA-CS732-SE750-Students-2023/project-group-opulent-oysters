import React from "react";
import { useState, useContext } from 'react';
import styles from "./Join.module.css";
import PinInput from "react-pin-input";
import { useRef } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { AppContextProvider } from "../../AppContextProvider";

export default function Join() {
  const context = useContext(AppContextProvider);
  const navigate = useNavigate();
  const [joined, setJoined] = React.useState(false);
  const [roomCode, setRoomCode] = React.useState();
  const username = useRef();
  const authUrl = "https://accounts.spotify.com/authorize";
  const clientId = "cddea26bbe4a468bae595c6581073ec2";

  function handleClickHost() {
    let url = authUrl;
    url += "?client_id=" + clientId;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI("http://localhost:5173/");
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url;
  }

  async function checkRoom(code) {
    axios
      .post(`https://localhost:7206/api/User/CheckCode?roomCode=${code}`)
      .then(response => {
        console.log(response.status)
        setRoomCode(code)
        setJoined(true)
      })
      .catch(error => {
        var inputPin = document.getElementById('test')
        inputPin.classList.add(styles.error);

        setTimeout(function () {
          inputPin.classList.remove(styles.error);
        }, 350);
      })
  }

  async function joinRoom() {
    if (username.current.value === '') {
      var inputField = document.getElementById('usernameField')
      inputField.classList.add(styles.error);

      setTimeout(function () {
        inputField.classList.remove(styles.error);
      }, 350);
    } else {
      await axios
        .post("https://localhost:7206/api/User", {
          username: username.current.value
        })
        .then(async (userResponse) => {
          await axios
            .post(`https://localhost:7206/api/User/JoinRoom?id=${userResponse.data.id}&username=${userResponse.data.username}&roomCode=${roomCode}`)
            .then((roomResponse) => {
              const cookies = new Cookies();
              cookies.set("userId", userResponse.data.id, { path: '/' });
              context.setRoomCode(roomCode);
              navigate("/dashboard", {state: {isHost: true}});
            })
        });
    }
  }

  return (
    <div>
      <div className={styles.container}>
        <h1>Join Party</h1>

        {joined ?
          (<div className={styles["container-fields"]}>
            <input id="usernameField" placeholder="Username" ref={username}></input>
            <button onClick={() => joinRoom()}>Submit</button>
          </div>) :
          (<div className={styles["container-fields"]}>
            <div id="test">
              <PinInput
                className={styles.testing}
                length={6}
                initialValue=""
                autoSelect={true}
                type="numeric"
                inputMode="number"
                onComplete={(roomCode) => { checkRoom(roomCode) }}
                regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
              />
            </div>

            <button className={styles["button-host"]} onClick={() => handleClickHost()}>Host Instead</button>
          </div>)}

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
