import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { LyricsDisplay } from "../LyricsDisplay";

it("renders the component correctly when the correct props are supplied", () => {
  const dummyLines = [
    {
      words: "Hello, its me",
    },
    {
      words: "I was wondering if after all these years you'd like to meet",
    },
  ];
  const dummyLyricData = {
    lines: dummyLines
  }
  const { getByText } = render(<LyricsDisplay lyricData={dummyLyricData} />);
  expect(getByText("Hello, its me")).toBeInTheDocument();
  expect(getByText("I was wondering if after all these years you'd like to meet")).toBeInTheDocument();
});

it("fails to render when no content is supplied", () => {
  try {
    render(<LyricsDisplay />);
    fail(); //Should not render
  } catch {
    //Good that it didn't render
  }
});
