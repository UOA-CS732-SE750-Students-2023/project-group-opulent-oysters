import styled from "styled-components";

const LineContainer = styled.div`
  p {
    color: white;
  }
`;
export function LyricLine({ line }) {
  console.log(line);
  return (
    <LineContainer>
      <p>{line.words} test</p>
    </LineContainer>
  );
}
