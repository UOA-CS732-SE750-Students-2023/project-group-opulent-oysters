import styled from "styled-components";

const LineContainer = styled.div`
  width: 100;
  text-align: center;
  p {
    color: #a0a0a0;
    font-size: 1.5rem;
  }

  .lyricComplete {
    color: white;
  }
`;

export function LyricLine({ line, id, className}) {
  return (
    <LineContainer>
      <p className={className} id={id}>{line.words}</p>
    </LineContainer>
  );
}
