import { LyricLine } from "./LyricLine";
import styled from "styled-components";
const LyricsContainer = styled.div`
  background-color: #0a031c;
  width: 100%;
  height: 80%;
`;
export function LyricsDisplay(prop) {
  const lyrics = prop.lyricData.lines;
  //   console.log(lyrics[0]);
  return (
    <LyricsContainer>
      {lyrics?.map((line, index) => (
          <LyricLine line={line} key={index} />

        // console.log("line");
      ))}
    </LyricsContainer>
  );
}
