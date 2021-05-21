import dashIcon from '@iconify-icons/bi/dash';
import plusIcon from '@iconify-icons/bi/plus';
import Icon from '@iconify/react';
import React, { useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import DataLoader from '../../components/DataLoader';
import LoadMoreButton from '../../components/LoadMoreButton';
import { PlainButton } from '../../components/PlainButton';
import { Typography } from '../../components/Typography';
import useNotification from '../../hooks/useNotification';
import useSaveToLibrary from '../../hooks/useSaveToLibrary';
import useScreenSize from '../../hooks/useScreenSize';
import { newReleasesService } from '../../services/spotifyService';

const Container = styled.div`
  padding: 1rem;
  width: 90%;
  max-width: 80rem;
  margin: auto;

  .albumsGrid {
    padding: 2rem 0;
    margin-top: 10px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    grid-template-rows: auto;
    column-gap: 1rem;
    row-gap: 2rem;

    .albumCard {
      display: grid;
      justify-content: center;
      gap: 5px;

      .albumArt {
        display: grid;
        justify-content: center;

        img {
          width: 15rem;
        }
      }
    }
  }
`;

interface IProps {
  isSearching: boolean;
}

const NewReleases = (props: IProps) => {
  const theme = useTheme();
  const sw = useScreenSize();
  const notify = useNotification();
  const savedAlbums = useSelector((state) => state.library.albums);
  const library = useSaveToLibrary('albums');
  const [limit] = useState(20);
  const newReleases = useInfiniteQuery(
    ['search', 'new-releases', limit],
    ({ pageParam = 0 }) => newReleasesService(pageParam, limit),
    {
      getNextPageParam: (lp) => (lp.albums.next ? lp.albums.offset + 1 : false),
      onError: () => notify.error('Error fetching new releases'),
    }
  );
  const items = useMemo(() => {
    return newReleases.data?.pages.map((p) => p.albums.items).flat() ?? [];
  }, [newReleases.data]);
  const itemCount = props.isSearching ? 4 : items.length ?? 0;

  if (sw.max(1200) && props.isSearching) return null;

  return (
    <Container>
      <Typography as="h1" textStyle="sm18">
        New Releases
      </Typography>
      <div role="list" aria-label="album list" className="albumsGrid">
        {items.slice(0, itemCount).map((album) => {
          const isSaved = savedAlbums[album.id] ?? false;

          return (
            <div key={album.id} role="listitem" className="albumCard">
              <div className="albumArt">
                <img
                  src={
                    album.images[0]?.url ?? 'https://picsum.photos/id/237/200'
                  }
                  alt="album art"
                />
              </div>
              <Typography
                textStyle="sm16"
                textAlign="center"
                textTheme={{ weight: 500 }}
                ellipsis
              >
                {album.name}
              </Typography>
              <PlainButton onClick={() => library.toggleSave(album.id)}>
                <Icon
                  icon={isSaved ? dashIcon : plusIcon}
                  height={'1.3rem'}
                  color={theme.text.colors.primary}
                />
                <Typography>{` ${
                  isSaved ? 'Remove from library' : 'Add to library'
                }`}</Typography>
              </PlainButton>
            </div>
          );
        })}
      </div>
      <DataLoader
        isLoading={newReleases.isLoading}
        hasData={items.length > 0}
        noDataText="Sorry, there is nothing new"
      />
      {!props.isSearching && <LoadMoreButton query={newReleases} />}
    </Container>
  );
};

export default NewReleases;
