import styles from "./Dashboard.module.css";

const currentSong = [
  {
    id: 1,
    name: "Come & Go",
    artist: "Juice WRLD",
    cover:
      "https://media.pitchfork.com/photos/5f08e1ae9f0d624cf3ecafc7/1:1/w_4500,h_4500,c_limit/legends%20never%20die_juice%20wrld.jpg",
  },
];

const songData = [
  {
    id: 1,
    name: "Come & Go",
    artist: "Juice WRLD",
    cover:
      "https://media.pitchfork.com/photos/5f08e1ae9f0d624cf3ecafc7/1:1/w_4500,h_4500,c_limit/legends%20never%20die_juice%20wrld.jpg",
  },
  {
    id: 2,
    name: "Come & Go",
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
    name: "Come & Go",
    artist: "Juice WRLD",
    cover:
      "https://media.pitchfork.com/photos/5f08e1ae9f0d624cf3ecafc7/1:1/w_4500,h_4500,c_limit/legends%20never%20die_juice%20wrld.jpg",
  },
  {
    id: 5,
    name: "Come & Go",
    artist: "Juice WRLD",
    cover:
      "https://media.pitchfork.com/photos/5f08e1ae9f0d624cf3ecafc7/1:1/w_4500,h_4500,c_limit/legends%20never%20die_juice%20wrld.jpg",
  },
  {
    id: 6,
    name: "Come & Go",
    artist: "Juice WRLD",
    cover:
      "https://media.pitchfork.com/photos/5f08e1ae9f0d624cf3ecafc7/1:1/w_4500,h_4500,c_limit/legends%20never%20die_juice%20wrld.jpg",
  },
  {
    id: 7,
    name: "Come & Go",
    artist: "Juice WRLD",
    cover:
      "https://media.pitchfork.com/photos/5f08e1ae9f0d624cf3ecafc7/1:1/w_4500,h_4500,c_limit/legends%20never%20die_juice%20wrld.jpg",
  },
];

export function Dashboard() {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.nav}>
          <div>
            <h1>David's Party</h1>
            <p>5 currently listening</p>
          </div>

          <div>
            <h1>Join Code:</h1>
            <p>547-767 </p>
          </div>
        </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder=" Search song"
            className={styles.searchbar}
          />
        </div>
        <div className={styles.dashboardContainer}>
          <div className={styles.recommendedContainer}>
            <h1>Recommended</h1>
            <div className={styles.recommendedGrid}>
              {songData.map((songs) => {
                return (
                  <div className={styles.song}>
                    <img src={songs.cover} alt="" />
                    <div className={styles.songInfo}>
                      <h3>{songs.name}</h3>
                      <p>{songs.artist}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.songContainer}>
            <div className={styles.queue}></div>
            <div className={styles.playing}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
