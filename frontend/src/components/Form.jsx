import styled from "styled-components";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;

  input {
    margin-top: 2vh;
    margin-left: auto;
    margin-right: auto;
    width: 10vw;
  }

  button {
    margin-top: 2vh;
    margin-left: auto;
    margin-right: auto;
    width: 5vw;
  }
`;

const CreateContainer = styled.div`
  margin-top: 5%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: row;

  a {
    margin-top: auto;
    margin-bottom: auto;
  }

  p {
    margin-top: auto;
    margin-bottom: auto;
  }
`;

export function Form() {
  return (
    <FormContainer>
      <input type="text" name="" id="" placeholder="Enter Code" />
      <button type="button">Join Party</button>

      <CreateContainer>
        <p>Create a party &nbsp;</p>
        <a href="">here</a>
        {/* change to login spotify screen  */}
      </CreateContainer>
    </FormContainer>
  );
}
