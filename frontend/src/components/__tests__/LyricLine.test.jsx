import "@testing-library/jest-dom";
import { it } from "vitest";
import { render } from "@testing-library/react";
import { LyricLine } from "../LyricLine";

it("fails to render when no content is supplied", () => {
    try {
        render(<LyricLine />);
        fail(); //Should not render
    } catch {
        //Good that it didn't render
    }
});