import { LyricLine } from "./LyricLine";
import styled from "styled-components";
const LyricsContainer = styled.div`
  height: 72%;
  width: 94%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  background-color: #0a031c;
  border-radius: 20px 20px 0px 0px;
  h1 {
    margin-left: 3%;
    text-align: center;
    opacity: 0.4;
    @media (max-width: 600px) {
      font-size: 1.2rem;
    }
  }

  > div {
    background-color: #0a031c;
    height: 100%;
    max-width: 97%;
    width: 100%;
    margin: auto;
    overflow-y: auto;
    margin-top: 1%;

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
  }
`;
export function LyricsDisplay(prop) {
  const lyrics = prop.lyricData.lines;
  return (
    <LyricsContainer>
      {/* <h1>
        {prop.name} by {prop.artists}
      </h1> */}
      <div>
        {lyrics?.map((line, index) => (
          <LyricLine line={line} key={index} />
        ))}
      </div>
    </LyricsContainer>
  );
}
