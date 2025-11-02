import styled from 'styled-components';

export const FlagResizer = styled.span<{ size: number }>`
  font-size: ${(props) => props.size}px;
`;
