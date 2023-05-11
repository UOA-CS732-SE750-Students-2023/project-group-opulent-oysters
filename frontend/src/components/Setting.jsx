import styled from "styled-components";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
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

    > h1 {
      margin-left: 4%;
    }
    > div {
      margin-left: 4%;
      display: flex;
    }
  }
`;

export function Setting({ roomCode, setExplicit, explicit }) {
  const updateExplicit = () => {
    axios
      .post(
        `https://localhost:7206/api/Host/UpdateExplicit?roomCode=${roomCode}`
      )
      .then((response) => {
        console.log(response);
      });

    setExplicit((current) => !current);
  };
  return (
    <Container>
      <div>
        <h1> Setting</h1>
        <div>
          <FormGroup>
            <FormControlLabel
              checked={explicit}
              control={<Switch />}
              label="Allow Explicit Songs"
              onChange={updateExplicit}
            />
          </FormGroup>
        </div>
      </div>
    </Container>
  );
}
