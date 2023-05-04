import React, { useEffect } from 'react'
import styles from "./LandingPage2.module.css";
import { useNavigate } from "react-router-dom";

export default function LandingPage2() {
    const navigate = useNavigate();
    const authUrl = "https://accounts.spotify.com/authorize";
    const clientId = "cddea26bbe4a468bae595c6581073ec2"; 

    useEffect(() => {
        if (window.location.search.length > 0) { //If query params in URL TODO: this also needs a check if there is a user currently signed in
            handleRedirect();
        }
    }, []) 

    function handleClick(path) {
        navigate(path)
    }

    function handleRedirect() {
        let code = getCodeFromUri();
        // TODO: create host in BE
        // TODO: create room in BE
        // TODO: redirect user to dashboard
        navigate('/dashboard')
        console.log(code);
    }
    
    function getCodeFromUri() {
        const queryString = window.location.search;
        return queryString.length > 0 ? new URLSearchParams(queryString).get("code") : null;
    }
    
    function handleClickHost() {
        let url = authUrl;
        url += "?client_id=" + clientId;
        url += "&response_type=code";
        url += "&redirect_uri=" + encodeURI("http://localhost:5173/");
        url += "&show_dialog=true";
        url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
        window.location.href = url;
    } 

    return (
        <div>
            <div className={styles.container}>
                <div className={styles['container-text']}>
                    <h1>AudioCloud</h1>

                    <div className={styles['container-subtext']}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/991px-Spotify_icon.svg.png" alt="Spotify Logo" />
                        <h2>Powered by Spotify</h2>
                    </div>
                </div>

                <div className={styles['container-split']}>
                    <div className={styles['container-left']}>
                        <button id={styles.button} onClick={() => handleClick('/join')}>Join</button>
                    </div>
                    <div className={styles['container-right']}>
                        <button id={styles.button} onClick={() => handleClickHost()}>Host</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
