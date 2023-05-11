import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Navbar } from "../Navbar";

it("renders the component correctly when the host is supplied", () => {
    const dummyHost = {
        name: "Andrew",
        partySize: 12,
        code: "123456"
    };
    const { getByText } = render(
        <Navbar host={dummyHost} />
    );
    expect(getByText(`${dummyHost.name}'s Party`)).toBeInTheDocument();
    expect(getByText(`${dummyHost.partySize} currently listening`)).toBeInTheDocument();
    expect(getByText(`Powered by Spotify`)).toBeInTheDocument();
    expect(getByText(`Join Code:`)).toBeInTheDocument();
    expect(getByText(`${dummyHost.code}`)).toBeInTheDocument();
});

it("fails to render when no content is supplied", () => {
    try {
        render(<Navbar />);
        fail(); //Should not render
    } catch {
        //Good that it didn't render
    }
});
