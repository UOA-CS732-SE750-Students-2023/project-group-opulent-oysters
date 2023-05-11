import styled from "styled-components";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";
const Container = styled.div`
  background-color: #0a031c;
  margin-left: auto;
  margin-right: auto;

  width: 100%;
  height: 79%;
  position: absolute;
  top: 21%;
  color: white;

  > div {
    width: 80%;
    height: 80%;
    border: dashed red 1px;
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

export function Setting({ roomCode }) {
  // const updateExplicit = (roomCode) => {

  //     axios
  //       .post(
  //         `https://localhost:7206/api/User/DownvoteSong?trackId=${trackId}&roomCode=${host.code}&userId=${userId}`
  //       )
  //       .then((response) => {
  //         // do something
  //       });
  //   };
  return (
    <Container>
      <div>
        <h1> Setting</h1>
        <div>
          <FormGroup>
            <FormControlLabel
              control={<Switch />}
              label="Disallow Explicit Songs"
              onChange={() => {}}
            />
          </FormGroup>
        </div>
      </div>
    </Container>
  );
}
