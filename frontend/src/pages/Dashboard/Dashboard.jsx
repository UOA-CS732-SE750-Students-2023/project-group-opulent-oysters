import { Navbar } from "../../components/Navbar";
import { Player } from "../../components/Player";
import { WebPlayback } from "../../components/WebPlayback";
import { Queue } from "../../components/Queue";
import styles from "./Dashboard.module.css";
import { useEffect, useState, useContext } from "react";
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
import { ToastContainer, toast } from "react-toastify";

import { AppContext } from "../../AppContextProvider";
import { TVMode } from "../../components/TVMode";
import "react-toastify/dist/ReactToastify.css";

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
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const cookies = new Cookies();

  const [isHost, setIsHost] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [queue, setQueue] = useState([]);
  const [isSettings, setSettings] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [lyricPosition, setLyricPosition] = useState(0);
  const [explicit, setExplicit] = useState(false);
  const [isTvMode, setIsTvMode] = useState(false);
  const [host, setHost] = useState({
    name: "",
    partySize: 0,
    code: "",
  });
  const [isLyrics, setIsLyrics] = useState(false);
  const [trackId, setTrackId] = useState();
  const checkExplicit = () => {
    axios
      .get(
        `${import.meta.env.VITE_URL}/api/Host/IsExplicit?roomCode=${context.roomCode
        }`
      )
      .then((response) => {
        setExplicit(response.data);
      });
  };
  useState(() => {
    if (location.state.isHost) {
      setIsHost(true);
    }

    loadHeaderInfo();
    loadQueue();
    // getLyrics();
    checkExplicit();
    setInterval(loadQueue, 1000);
    setInterval(loadHeaderInfo, 1000);
  }, []);

  const notifySuccess = () => {
    toast.success("Song Added");
  };

  const notifyFail = () => {
    toast.error("Failed to add / Already in queue");
  };

  const notifyRemoveSong = () => {
    toast.success("Song Removed");
  };

  function loadQueue() {
    axios
      .get(
        `${import.meta.env.VITE_URL}/api/Host/GetQueue?roomCode=${context.roomCode
        }`
      )
      .then((response) => {
        setQueue(response.data);
      });
  }

  function loadHeaderInfo() {
    +axios
      .post(
        `${import.meta.env.VITE_URL}/api/User/GetRoom?roomCode=${context.roomCode
        }`
      )
      .then((response) => {
        setHost({
          name: response.data.ownerName,
          partySize: response.data.users.length + 1,
          code: context.roomCode,
        });
      });
  }

  const search = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value == "") {
      setIsSearching(false);
      setIsLyrics(false);
      setSettings(false);
      setIsTvMode(false);
    } else {
      setIsSearching(true);
      setIsLyrics(false);
      setSettings(false);
      setIsTvMode(false);
      axios
        .post(
          `${import.meta.env.VITE_URL}/api/User/SearchSong?searchTerm=${event.target.value
          }&roomCode=${context.roomCode}`
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
        `${import.meta.env.VITE_URL
        }/api/User/UpvoteSong?trackId=${trackId}&roomCode=${host.code
        }&userId=${userId}`
      )
      .then((response) => {
        // do something
      });
  };

  const downvoteSong = (trackId) => {
    const userId = cookies.get("userId");
    axios
      .post(
        `${import.meta.env.VITE_URL
        }/api/User/DownvoteSong?trackId=${trackId}&roomCode=${host.code
        }&userId=${userId}`
      )
      .then((response) => {
        // do something
      });
  };

  const removeSong = (trackId) => {
    const userId = cookies.get("userId");
    axios
      .delete(
        `${import.meta.env.VITE_URL
        }/api/Host/RemoveSong?trackId=${trackId}&roomCode=${host.code
        }&hostId=${userId}`
      )
      .then((response) => {
        notifyRemoveSong();
      });
  };

  const addSong = (trackId) => {
    const userId = cookies.get("userId");
    axios
      .post(
        `${import.meta.env.VITE_URL
        }/api/User/AddSong?trackId=${trackId}&roomCode=${host.code
        }&userId=${userId}`
      )
      .then((response) => {
        if (response.status == 204) {
          notifySuccess();
        }
      })
      .catch((error) => {
        notifyFail();
      });
  };

  const handleLyricsMode = () => {
    if (isLyrics) {
      setIsLyrics(false);
      setSettings(false);
      setIsTvMode(false);
    } else {
      setIsLyrics(true);
      setSettings(false);
      setIsTvMode(false);
    }
  };

  useEffect(() => {
    axios
      .get(
        `https://spotify-lyric-api.herokuapp.com/?trackid=${trackId}`
      )
      .then((response) => {
        setLyrics(response.data);
      })
      .catch((error) => {
        setLyrics({})
      });
  }, [trackId])

  const handleSettings = () => {
    if (isSettings) {
      setIsLyrics(false);
      setSettings(false);
      setIsTvMode(false);
    } else {
      setIsLyrics(false);
      setSettings(true);
      setIsTvMode(false);
    }
  };
  const handleTvMode = () => {
    if (isTvMode) {
      setIsLyrics(false);
      setSettings(false);
      setIsTvMode(false);
    } else {
      setIsLyrics(false);
      setSettings(false);
      setIsTvMode(true);
    }
  };

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
                  <button className={styles.tvButton} onClick={handleTvMode}>
                    <MdScreenshotMonitor style={{ fontSize: "22px" }} />
                  </button>
                  <h2 className={styles.appName}>AudioCloud</h2>
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
            lyricPosition={lyricPosition}
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
            <WebPlayback queue={queue} hostId={cookies.get("userId")} setLyricPosition={setLyricPosition} setTrackId={setTrackId} />
          ) : null}
        </PlayerContainer>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          limit={5}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>

      <div>
        {isTvMode ? (
          <TVMode handleClose={handleTvMode} host={host}></TVMode>
        ) : null}
        {isSettings ? (
          <Setting
            roomCode={context.roomCode}
            setExplicit={setExplicit}
            explicit={explicit}
          />
        ) : null}
      </div>
    </div>
  );
}
