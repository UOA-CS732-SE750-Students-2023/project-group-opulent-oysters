import { LyricLine } from "./LyricLine";
import styled from "styled-components";
import React, { useState, useEffect } from "react";

const LyricsContainer = styled.div`
  height: 72%;
  width: 94%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  background-color: #0a031c;
  border-radius: 20px 20px 0px 0px;
  scroll-behavior: auto;
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
    margin-top: 2%;

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

const NoLyricsText = styled.h3`
  margin-left: 3%;
  text-align: center;
  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;

export function LyricsDisplay(prop) {
  const lyrics = prop.lyricData.lines;
  const [currentLyric, setCurrentLyric] = useState();

  useEffect(() => {
    setCurrentLyric();
    scrollToLyric(0);
  }, [prop.lyricData.lines]);

  const scrollToLyric = (index) => {
    if (currentLyric == null || index > currentLyric) {
      const element = document.getElementById(index);

      if (!element) {
        return;
      }

      setCurrentLyric(index);

      if (index == 1) {
        element.scrollIntoView({
          block: "center",
          inline: "center",
        });
      } else {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }
  };

  return (
    <LyricsContainer>
      {(prop.lyricData && Object.keys(prop.lyricData).length === 0 && Object.getPrototypeOf(prop.lyricData) === Object.prototype) ? (
        <div>
          <NoLyricsText>Could not find lyrics</NoLyricsText>
        </div>
      ) : (
        <div>
          {lyrics?.map((line, index) => {
            if (prop.lyricPosition > line.startTimeMs) {
              scrollToLyric(index);
              return (
                <>
                  <LyricLine
                    line={line}
                    key={index}
                    id={index}
                    className="lyricComplete"
                  />
                </>
              );
            } else {
              return <LyricLine line={line} key={index} id={index} />;
            }
          })}
        </div>
      )}
    </LyricsContainer>
  );
}
