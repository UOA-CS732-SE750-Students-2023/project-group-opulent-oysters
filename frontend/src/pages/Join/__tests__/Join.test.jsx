import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Join from "../Join";

it("renders the join page correctly", () => {
  const { getByText } = render(
    <MemoryRouter>
      <Join />
    </MemoryRouter>
  );
  expect(getByText("AudioCloud")).toBeInTheDocument();
  expect(getByText("Join Party")).toBeInTheDocument();
  expect(getByText("Powered by Spotify")).toBeInTheDocument();
  expect(getByText("Host Instead")).toBeInTheDocument();
});
