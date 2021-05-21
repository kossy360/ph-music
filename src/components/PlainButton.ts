import * as CSS from 'csstype';
import styled from 'styled-components';

interface IProps {
  justify?: CSS.Properties['justifyContent'];
  align?: CSS.Properties['alignItems'];
}

export const PlainButton = styled.button.attrs({ type: 'button' })<IProps>`
  background: none;
  cursor: pointer;
  outline: none;
  border: none;
  display: inline-flex;
  align-items: ${(p) => p.align ?? 'center'};
  justify-content: ${(p) => p.justify ?? 'center'};
`;
