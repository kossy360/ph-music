import styled from 'styled-components';
import LibraryList from './LibraryList';
import TopBar from './TopBar';

const Container = styled.div`
  display: grid;
  grid-auto-rows: max-content 1fr;
  height: 100%;

  .bottomSection {
    height: 100%;
    overflow: auto;
  }
`;

const Library = () => {
  return (
    <Container>
      <TopBar />
      <div className="bottomSection">
        <LibraryList />
      </div>
    </Container>
  );
};

export default Library;
