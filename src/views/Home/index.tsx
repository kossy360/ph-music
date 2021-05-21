import React, { useState } from 'react';
import styled from 'styled-components';
import NewReleases from './NewReleases';
import SearchResult from './SeachResult';
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

const Home = () => {
  const [search, setSearch] = useState('');

  return (
    <Container>
      <TopBar onSearchChange={setSearch} />
      <div className="bottomSection">
        <NewReleases isSearching={!!search} />
        <SearchResult search={search} />
      </div>
    </Container>
  );
};

export default Home;
