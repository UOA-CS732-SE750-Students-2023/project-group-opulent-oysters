import React from 'react'
import styles from './Join.module.css'
import PinInput from 'react-pin-input';

export default function Join() {
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
                    onChange={(value, index) => { }}
                    onComplete={(value, index) => { console.log(value) }}
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

                <button>Host Instead</button>

                <div className={styles['container-brand']}>
                    <h2>AudioCloud</h2>

                    <div className={styles['container-subbrand']}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/991px-Spotify_icon.svg.png" alt="Spotify Logo" />
                        <h3>Powered by Spotify</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}
