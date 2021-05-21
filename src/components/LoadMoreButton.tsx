import { CircularProgress } from '@material-ui/core';
import { UseInfiniteQueryResult } from 'react-query';
import styled from 'styled-components';
import { Typography } from './Typography';

const Container = styled.div`
  display: flex;
  justify-content: center;

  .loadMore {
    padding: 10px 20px;
    background: black;
    border: none;
    border-radius: 6px;
    outline: none;
    font-family: 'fira sans';
    width: max-content;
    cursor: pointer;
  }

  .MuiCircularProgress-svg {
    color: black;
  }
`;

interface IProps {
  query: UseInfiniteQueryResult;
}

const LoadMoreButton = (props: IProps) => {
  const { query } = props;

  if (!query.hasNextPage) return null;

  return (
    <Container>
      {query.isLoading || query.isFetchingNextPage ? (
        <CircularProgress size={32} thickness={5} />
      ) : (
        <button className="loadMore" onClick={() => query.fetchNextPage()}>
          <Typography textColor="accent">Load more</Typography>
        </button>
      )}
    </Container>
  );
};

export default LoadMoreButton;
