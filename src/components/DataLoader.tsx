import { CircularProgress } from '@material-ui/core';
import styled from 'styled-components';
import { Typography } from './Typography';

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem 0;

  .MuiCircularProgress-svg {
    color: black;
  }
`;

interface IProps {
  isLoading: boolean;
  hasData: boolean;
  noDataText: string;
}

const DataLoader = (props: IProps) => {
  const { isLoading, hasData, noDataText } = props;

  if (!isLoading && hasData) return null;

  return (
    <Container>
      {isLoading && <CircularProgress size={70} thickness={4} />}
      {!isLoading && !hasData && (
        <Typography textStyle="sm18" textColor="primary600" textAlign="center">
          {noDataText}
        </Typography>
      )}
    </Container>
  );
};

export default DataLoader;
