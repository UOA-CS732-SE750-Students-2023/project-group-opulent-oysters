import styled from "styled-components";

const NavbarContainer = styled.div`
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1%;
`;

const LeftNav = styled.div`
  margin-left: 3%;
  h1 {
    font-size: 2.5rem;

    @media (max-width: 600px) {
      font-size: 1.2rem;
    }
  }
  p {
    font-size: 1rem;

    @media (max-width: 600px) {
      font-size: 0.7rem;
    }
  }
`;

const RightNav = styled.div`
  text-align: right;
  margin-right: 3%;
  h1 {
    font-size: 2.5rem;

    @media (max-width: 600px) {
      font-size: 1.2rem;
    }
  }
  p {
    font-size: 1rem;

    @media (max-width: 600px) {
      font-size: 0.7rem;
    }
  }
`;

export function Navbar({ host }) {
  return (
    <NavbarContainer>
      <LeftNav>
        <h1>{host.name}'s Party</h1>
        <p>{host.partySize} currently listening</p>
      </LeftNav>

      <RightNav>
        <h1>Join Code:</h1>
        <p>{host.code} </p>
      </RightNav>
    </NavbarContainer>
  );
}
