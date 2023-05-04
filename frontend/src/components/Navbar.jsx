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
`;

const RightNav = styled.div`
  margin-right: 3%;
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
