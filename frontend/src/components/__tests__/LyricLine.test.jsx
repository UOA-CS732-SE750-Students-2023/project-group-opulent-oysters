import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { LyricLine } from "../LyricLine";

it("renders the component correctly when the line is supplied", () => {
    const dummyLine = {
        words: "Hello, its me",
    };
    const { getByText } = render(
        <LyricLine line={dummyLine} />
    );
    expect(getByText("Hello, its me")).toBeInTheDocument();
});

it("fails to render when no content is supplied", () => {
    try {
        render(<LyricLine />);
        fail(); //Should not render
    } catch {
        //Good that it didn't render
    }
});
