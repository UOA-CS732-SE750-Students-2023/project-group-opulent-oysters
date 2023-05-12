import styled from "styled-components";
import SongResult from "./SongResult";

const DashboardContainer = styled.div`
  height: 68%;
  width: 94%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  background-color: #0a031c;
  border-radius: 20px;
  @media (max-width: 600px) {
    height: 67%;
  }

  h1 {
    margin-left: 4%;

    @media (max-width: 600px) {
      font-size: 1.2rem;
    }
  }
`;

const QueueContainer = styled.div`
  background-color: #0a031c;
  height: 100%;
  max-width: 94%;
  width: 100%;
  margin: auto;
  overflow-y: auto;
  margin-bottom: 1%;

  @media (max-width: 600px) {
    margin-bottom: 5%;
  }
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  @media (max-width: 600px) {
    ::-webkit-scrollbar {
      width: 3px;
    }
  }
`;

const SongsContainer = styled.div`
  flex-grow: 1;
`;

export function Queue(props) {
  return (
    <DashboardContainer>
      <h1>{props.searchResult ? "Search Result" : "Queue"}</h1>

      <QueueContainer>
        <SongsContainer>
          {props.searchResults.map((song, index) => (
            <SongResult
              song={song}
              upvoteSong={props.upvoteSong}
              downvoteSong={props.downvoteSong}
              key={index}
              addSong={props.addSong}
              searchResult={props.searchResult}
              isHost={props.isHost}
              removeSong={props.removeSong}
            />
          ))}
        </SongsContainer>
      </QueueContainer>
    </DashboardContainer>
  );
}
