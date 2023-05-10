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
      {lyrics?.map((line, index) => {
        console.log(line.words);
        <div>
          <LyricLine line={line} key={index} />;
        </div>;

        // console.log("line");
      })}
    </LyricsContainer>
  );
}
