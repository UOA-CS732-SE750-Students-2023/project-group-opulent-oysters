import { Navbar } from "../../components/Navbar";
import { Player } from "../../components/Player";
import { Player2 } from "../../components/Player2";
import { Queue } from "../../components/Queue";
import styles from "./Dashboard.module.css";
import { useState } from "react";
import styled from "styled-components";
import useGet from "../../util/useGet";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

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

// useGet();

const songData = [
  {
    id: 1,
    name: "Nights",
    artist: "Frank Ocean",
    cover:
      "https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg",
  },
  {
    id: 2,
    name: "Hello",
    artist: "Juice WRLD",
    cover:
      "https://media.pitchfork.com/photos/5f08e1ae9f0d624cf3ecafc7/1:1/w_4500,h_4500,c_limit/legends%20never%20die_juice%20wrld.jpg",
  },
  {
    id: 3,
    name: "Come & Go",
    artist: "Juice WRLD",
    cover:
      "https://media.pitchfork.com/photos/5f08e1ae9f0d624cf3ecafc7/1:1/w_4500,h_4500,c_limit/legends%20never%20die_juice%20wrld.jpg",
  },
  {
    id: 4,
    name: "Lucid Dreams",
    artist: "Juice WRLD",
    cover:
      "https://media.pitchfork.com/photos/5f08e1ae9f0d624cf3ecafc7/1:1/w_4500,h_4500,c_limit/legends%20never%20die_juice%20wrld.jpg",
  },
  {
    id: 5,
    name: "OMG",
    artist: "NewJeans",
    cover: "https://i.scdn.co/image/ab67616d0000b273d70036292d54f29e8b68ec01",
  },
  {
    id: 6,
    name: "Ditto",
    artist: "NewJeans",
    cover: "https://i.scdn.co/image/ab67616d00001e02edf5b257be1d6593e81bb45f",
  },
  {
    id: 7,
    name: "Come & Go",
    artist: "Juice WRLD",
    cover:
      "https://media.pitchfork.com/photos/5f08e1ae9f0d624cf3ecafc7/1:1/w_4500,h_4500,c_limit/legends%20never%20die_juice%20wrld.jpg",
  },
];

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
`;

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isHost, setIsHost] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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

    axios
    .post(`https://localhost:7206/api/User/GetRoom?roomCode=${location.state.code}`)
    .then((response) => {
      setHost({
        name: response.data.ownerName,
        partySize: response.data.users.length + 1,
        code: location.state.code
      })
    });
  }, [])

  return (
    <div>
      <div className={styles.container}>
        <Navbar host={host} />

        <div className={styles.searchContainer}>
          <input
            type="search"
            placeholder="Search Song/Artist"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchbarModule}
          />
        </div>

        <Queue searchResults={songData} />
        <PlayerContainer>
          { isHost ? 
          <Player
            trackUris={["spotify:track:65FftemJ1DbbZ45DUfHJXE", "spotify:track:6kls8cSlUyHW2BUOkDJIZE", "spotify:track:6Gg1gjgKi2AK4e0qzsR7sd"]}
            accessToken={accessToken}
          /> : null}
        </PlayerContainer>
      </div>
    </div>
  );
}
