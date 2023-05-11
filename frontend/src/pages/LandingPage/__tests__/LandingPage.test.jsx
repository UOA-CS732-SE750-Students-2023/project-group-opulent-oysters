import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "../LandingPage";

it("renders the landing page correctly", () => {
  const { getByText } = render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>
  );
  expect(getByText("AudioCloud")).toBeInTheDocument();
  expect(getByText("Join")).toBeInTheDocument();
  expect(getByText("Powered by Spotify")).toBeInTheDocument();
  expect(getByText("Host")).toBeInTheDocument();
});
