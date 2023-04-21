import React from 'react'
import styles from "./LandingPage2.module.css";
import { useNavigate } from "react-router-dom";

export default function LandingPage2() {
    const navigate = useNavigate();

    function handleClick(path) {
        navigate(path)
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
                        <button id={styles.button}>Host</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
