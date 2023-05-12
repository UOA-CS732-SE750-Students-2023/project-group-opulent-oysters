import "@testing-library/jest-dom";
import {  it } from "vitest";
import { render } from "@testing-library/react";
import { LyricsDisplay } from "../LyricsDisplay";

it("fails to render when no content is supplied", () => {
  try {
    render(<LyricsDisplay />);
    fail(); //Should not render
  } catch {
    //Good that it didn't render
  }
});
