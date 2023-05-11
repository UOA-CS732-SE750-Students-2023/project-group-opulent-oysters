import styled from "styled-components";
import axios from "axios";
import { useState } from "react";
const Container = styled.div`
  background-color: #0a031c;
  margin-left: auto;
  margin-right: auto;

  width: 100%;
  height: 79%;
  position: absolute;
  top: 21%;
  color: white;

  @media (max-width: 600px) {
    height: 80%;
    top: 20%;
  }

  > div {
    width: 80%;
    height: 80%;

    margin: auto;
  }
`;

export function TVmode() {
  return (
    <Container>
      <div></div>
    </Container>
  );
}
