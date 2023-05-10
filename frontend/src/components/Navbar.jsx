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

  div {
    display: flex;
    h1 {
      font-size: 2.5rem;
      overflow-x: auto;

      @media (max-width: 600px) {
        font-size: 1.2rem;
      }
    }
  }
  p {
    margin-block-start: 0;
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
    background-clip: text;
    font-size: 2rem;
    user-select: text;

    @media (max-width: 600px) {
      font-size: 0.7rem;
    }
  }
`;

const PoweredBySpotify = styled.div`
  display: flex;
  margin-left: 20px;

  img {
    height: 30px;
    width: 30px;
    margin-top: auto;
    margin-bottom: auto;
    @media (max-width: 1000px) {
      display: none;
    }
  }

  p {
    margin-left: 5px;
    margin-top: auto;
    margin-bottom: auto;
    @media (max-width: 1000px) {
      display: none;
    }
  }
`;

export function Navbar({ host }) {
  return (
    <NavbarContainer>
      <LeftNav>
        <div>
          <h1>{host.name}'s Party</h1>
          <PoweredBySpotify>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/991px-Spotify_icon.svg.png"
              alt="Spotify Logo"
            />
            <p>Powered by Spotify</p>
          </PoweredBySpotify>
        </div>

        <p>{host.partySize} currently listening</p>
      </LeftNav>

      <RightNav>
        <h1>Join Code:</h1>
        <p>{host.code} </p>
      </RightNav>
    </NavbarContainer>
  );
}
