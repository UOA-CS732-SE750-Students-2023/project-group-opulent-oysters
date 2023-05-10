import { Navbar } from "../../components/Navbar";
import { Player } from "../../components/Player";
import { Player2 } from "../../components/Player2";
import { Queue } from "../../components/Queue";
import styles from "./Dashboard.module.css";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useGet from "../../util/useGet";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Cookies from "universal-cookie";

const player2track = {
  name: "Ivy",
  album: {
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg",
      },
    ],
  },
  artists: [{ name: "Frank hates us" }],
};

//   const track = {
//     name: "",
//     album: {
//         images: [
//             { url: "" }
//         ]
//     },
//     artists: [
//         { name: "" }
//     ]
// }

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
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
  const [host, setHost] = useState({
    name: "Name",
    partySize: 5,
    code: "123456",
  });

  useState(() => {
    if (location.state.accessToken) {
      setIsHost(true);
      setAccessToken(location.state.accessToken);
    }

    loadHeaderInfo();
    loadQueue();
    setInterval(loadQueue, 5000);
    setInterval(loadHeaderInfo, 5000);
  }, []);

  function loadQueue() {
    axios
    .get(
      `https://localhost:7206/api/Host/GetQueue?roomCode=${location.state.code}`
    )
    .then((response) => {
      console.log(response);
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
    }
  );
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
      // console.log(searchResults);
    }
  };

  const upvoteSong = (trackId) => {
    const userId = cookies.get("userId");
    axios
    .post(`https://localhost:7206/api/User/UpvoteSong?trackId=${trackId}&roomCode=${host.code}&userId=${userId}`)
    .then((response) => {
      // do something
    });
  }

  const downvoteSong = (trackId) => {
    const userId = cookies.get("userId");
    axios
    .post(`https://localhost:7206/api/User/DownvoteSong?trackId=${trackId}&roomCode=${host.code}&userId=${userId}`)
    .then((response) => {
      // do something
    });
  }

  const addSong = (trackId) => {
    axios
      .post(
        `https://localhost:7206/api/User/AddSong?trackId=${trackId}&roomCode=${host.code}`
      )
      .then((response) => {
        console.log(response);
      });
  }

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
          </div>
        </div>
        {isSearching ? (
          <Queue searchResults={searchResults} addSong={addSong} searchResult={true} />
        ) : (
          <Queue searchResults={queue} upvoteSong={upvoteSong} downvoteSong={downvoteSong} searchResult={false} />
        )}
        <PlayerContainer>
          {isHost ? (
            <Player
              trackUris={[
                "spotify:track:65FftemJ1DbbZ45DUfHJXE",
                "spotify:track:6kls8cSlUyHW2BUOkDJIZE",
                "spotify:track:6Gg1gjgKi2AK4e0qzsR7sd",
              ]}
              accessToken={accessToken}
            />
          ) : null}
        </PlayerContainer>
      </div>
    </div>
  );
}
