import React from "react";
import styles from "./Join.module.css";
import PinInput from "react-pin-input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Join() {
	const navigate = useNavigate();

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

    async function joinRoom(code) {
		console.log("EHHREHHE")
		if ((code - 99999) <= 0) { // change this to the onComplete thingy lmfaooooooo
			console.log("failed")
			return;
		}

		await axios
		.post("https://localhost:7206/api/User", {
			username: "Minghao Lin",
		})
		.then(async (userResponse) => {
			console.log(userResponse.data.id);
			console.log(userResponse.data.username);
			console.log(code);
			await axios
			.post(`https://localhost:7206/api/User/JoinRoom?id=${userResponse.data.id}&username=${userResponse.data.username}&roomCode=${code}`)
			.then((roomResponse) => {
				navigate("/dashboard", {
				state: {
					code: code,
				}
				});
			})
		});
    }

    return (
        <div>
            <div className={styles.container}>
                <h1>Join Party</h1>
                <PinInput
                    length={6}
                    initialValue=""
                    autoSelect={true}
                    type="numeric"
                    inputMode="number"
                    onChange={(value, index) => { console.log(value) }}
                    onComplete={(value, index) => {joinRoom(value)}} // this doesnt work for me for some reason
                    regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
                    style={{
                        padding: '10px',
                    }}
                    inputStyle={{
                        borderColor: 'white',
                        background: 'linear-gradient(99.76deg, rgba(255, 75, 237, 0.14) -1%, rgba(0, 19, 86, 0.14) 100.19%), rgba(69, 69, 69, 0.57)',
                        color: 'white',
                        borderRadius: '50px',
                        fontSize: '77px',
                        padding: '30px',
                        height: '93px',
                        margin: 'auto 15px',
                        fontWeight: '800'
                    }}
                    inputFocusStyle={{
                        borderColor: 'green'
                    }}
                />

                <button onClick={() => handleClickHost()}>Host Instead</button>


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
