import { Navbar } from "../../components/Navbar";
import { Player } from "../../components/Player";
import { WebPlayback } from "../../components/WebPlayback";
import { Queue } from "../../components/Queue";
import styles from "./Dashboard.module.css";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useGet from "../../util/useGet";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Cookies from "universal-cookie";
import { LyricsDisplay } from "../../components/LyricsDisplay";
import { TbMicrophone2 } from "react-icons/Tb";
import { AiTwotoneSetting } from "react-icons/Ai";
import { MdScreenshotMonitor, MdQueueMusic } from "react-icons/Md";
import { Setting } from "../../components/Setting";

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;

  height: 8%;

  @media (max-width: 600px) {
    height: 11%;
  }
`;

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const cookies = new Cookies();

  const [isHost, setIsHost] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [queue, setQueue] = useState([]);
  const [isSettings, setSettings] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [explicit, setExplicit] = useState(false);
  const [host, setHost] = useState({
    name: "",
    partySize: 0,
    code: "",
  });
  const [isLyrics, setIsLyrics] = useState(false);

  useState(() => {
    if (location.state.accessToken) {
      setIsHost(true);
      setAccessToken(location.state.accessToken);
    }

    loadHeaderInfo();
    loadQueue();
    getLyrics();
    setInterval(loadQueue, 1000);
    setInterval(loadHeaderInfo, 1000);
  }, []);

  function loadQueue() {
    axios
      .get(
        `https://localhost:7206/api/Host/GetQueue?roomCode=${location.state.code}`
      )
      .then((response) => {
        setQueue(response.data);
      });
  }

  function loadHeaderInfo() {
    axios
      .post(
        `https://localhost:7206/api/User/GetRoom?roomCode=${location.state.code}`
      )
      .then((response) => {
        setHost({
          name: response.data.ownerName,
          partySize: response.data.users.length + 1,
          code: location.state.code,
        });
      });
  }

  const search = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value == "") {
      setIsSearching(false);
    } else {
      setIsSearching(true);
      axios
        .post(
          `https://localhost:7206/api/User/SearchSong?searchTerm=${event.target.value}&roomCode=${location.state.code}`
        )
        .then((response) => {
          setSearchResults(response.data);
        });
    }
  };

  const upvoteSong = (trackId) => {
    const userId = cookies.get("userId");
    axios
      .post(
        `https://localhost:7206/api/User/UpvoteSong?trackId=${trackId}&roomCode=${host.code}&userId=${userId}`
      )
      .then((response) => {
        // do something
      });
  };

  const downvoteSong = (trackId) => {
    const userId = cookies.get("userId");
    axios
      .post(
        `https://localhost:7206/api/User/DownvoteSong?trackId=${trackId}&roomCode=${host.code}&userId=${userId}`
      )
      .then((response) => {
        // do something
      });
  };

  const removeSong = (trackId) => {
    const userId = cookies.get("userId");
    axios
      .delete(
        `https://localhost:7206/api/Host/RemoveSong?trackId=${trackId}&roomCode=${host.code}&hostId=${userId}`
      )
      .then((response) => {
        // do something
      });
  };

  const addSong = (trackId) => {
    const userId = cookies.get("userId");
    axios
      .post(
        `https://localhost:7206/api/User/AddSong?trackId=${trackId}&roomCode=${host.code}&userId=${userId}`
      )
      .then((response) => {
        console.log(response);
      });
  };

  const handleLyricsMode = () => {
    if (isLyrics) {
      setIsLyrics(false);
      setSettings(false);
    } else {
      setIsLyrics(true);
      setSettings(false);
    }
  };
  function getLyrics() {
    axios
      .get(
        `https://spotify-lyric-api.herokuapp.com/?trackid=6kls8cSlUyHW2BUOkDJIZE`
      )
      .then((response) => {
        setLyrics(response.data);
      });
  }

  const handleSettings = () => {
    if (isSettings) {
      setIsLyrics(false);
      setSettings(false);
    } else {
      setIsLyrics(false);
      setSettings(true);
    }
  };

  // console.log(lyrics);
  return (
    <div>
      <div className={styles.container}>
        <Navbar host={host} />

        <div className={styles.searchContainer}>
          <div className={styles.searchBar}>
            <input
              type="search"
              placeholder="Search Song/Artist"
              value={searchTerm}
              onChange={search}
              className={styles.searchbarModule}
            />
            <div className={styles.buttonContainer}>
              <button
                onClick={handleLyricsMode}
                className={styles.lyricsButton}
                style={isLyrics ? { backgroundColor: "#818181" } : {}}
              >
                <TbMicrophone2 style={{ fontSize: "22px" }} />
              </button>
              {isHost ? (
                <>
                  <button
                    className={styles.settingsButton}
                    onClick={handleSettings}
                    style={isSettings ? { backgroundColor: "#818181" } : {}}
                  >
                    <AiTwotoneSetting style={{ fontSize: "22px" }} />
                  </button>
                  <button className={styles.tvButton}>
                    <MdScreenshotMonitor style={{ fontSize: "22px" }} />
                  </button>
                  <h2 className={styles.appName}>Audio Cloud</h2>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {isLyrics ? (
          <LyricsDisplay
            lyricData={lyrics}
            name={"Hate Me"}
            artists={"Ellie Goulding, Juice WRLD"}
          />
        ) : (
          <>
            {isSearching ? (
              <Queue
                searchResults={searchResults}
                addSong={addSong}
                searchResult={true}
              />
            ) : (
              <Queue
                searchResults={queue}
                upvoteSong={upvoteSong}
                downvoteSong={downvoteSong}
                searchResult={false}
                isHost={isHost}
                removeSong={removeSong}
              />
            )}
          </>
        )}

        <PlayerContainer>
          {isHost ? (
            // <Player
            //   trackUris={["spotify:track:6kls8cSlUyHW2BUOkDJIZE"]}
            //   accessToken={accessToken}
            // />
            <WebPlayback token={accessToken} />
          ) : null}
        </PlayerContainer>
      </div>

      <div>
        {isSettings ? (
          <Setting
            roomCode={location.state.code}
            setExplicit={setExplicit}
            explicit={explicit}
          />
        ) : null}
      </div>
    </div>
  );
}
