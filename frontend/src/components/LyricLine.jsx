import styled from "styled-components";

const LineContainer = styled.div`
  width: 100;
  text-align: center;
  p {
    color: #a0a0a0;
    font-size: 1.5rem;
  }
`;
export function LyricLine({ line }) {
  console.log(line);
  return (
    <LineContainer>
      <p>{line.words}</p>
    </LineContainer>
  );
}
