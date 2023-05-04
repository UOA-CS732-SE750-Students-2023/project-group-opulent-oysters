import { Navbar } from "../../components/Navbar";
import { Player } from "../../components/Player";
import { Queue } from "../../components/Queue";
import styles from "./Dashboard.module.css";
import { useState } from "react";
import styled from "styled-components";

const host = {
  name: "David",
  partySize: 5,
  code: "123456",
};

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
    name: "Come & Goergerg",
    artist: "Juice WRLD",
    cover:
      "https://media.pitchfork.com/photos/5f08e1ae9f0d624cf3ecafc7/1:1/w_4500,h_4500,c_limit/legends%20never%20die_juice%20wrld.jpg",
  },
  {
    id: 4,
    name: "Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go Come & Go",
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

const PlayerContainer = styled.div``;

export function Dashboard() {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // const accessToken
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
          <Player
            trackUri={"spotify:track:65FftemJ1DbbZ45DUfHJXE"}
            accessToken={
              "BQDmwBp1Cje2oe1PF2SmnVW5DuvpwBDzYBpDRLmw15M657oyTlhMrVsjuxCvDBZWQ85vl4M8gerYOdkSER8jxLB7idwWDXT8l_TERJr9D5C4GbTfZqXCmQdF-x1y_n3CdOK3PXXCMYWBca0Gv-zDtbGl2kD_lBR3hmlcbxNqkDukZEfEZKROoGQwLdX6OEEwthJGvP5SiuQJtR4KJE9pmgbQpJ7bzDojENviPLheJ_hVak6sjEP8jOKOZOA"
            }
          />
        </PlayerContainer>
      </div>
    </div>
  );
}
