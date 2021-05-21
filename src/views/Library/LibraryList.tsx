import dashIcon from '@iconify-icons/bi/dash';
import Icon from '@iconify/react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import styled, { useTheme } from 'styled-components';
import DataLoader from '../../components/DataLoader';
import { PlainButton } from '../../components/PlainButton';
import { Typography } from '../../components/Typography';
import useNotification from '../../hooks/useNotification';
import useSaveToLibrary from '../../hooks/useSaveToLibrary';
import { getAlbumsByIdsService, getTracksByIdsService } from '../../services/spotifyService';
import { ISpotifyAlbum, ISpotifyTrack } from '../../types/spotify';

const Container = styled.div`
  width: 90%;
  padding: 1rem;
  max-width: 80rem;
  margin: auto;

  .librarySection {
    .albumsGrid {
      padding: 2rem 0;
      margin-top: 10px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
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
  }
`;

const LibraryCard = ({
  item,
  onRemove,
}: {
  item: ISpotifyAlbum | ISpotifyTrack;
  onRemove: VoidFunction;
}) => {
  const theme = useTheme();
  const album = (item as ISpotifyTrack).album
    ? (item as ISpotifyTrack).album
    : (item as ISpotifyAlbum);

  return (
    <div role="listitem" className="albumCard">
      <div className="albumArt">
        <img
          src={album.images[0]?.url ?? 'https://picsum.photos/id/237/200'}
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
      <PlainButton onClick={onRemove}>
        <Icon
          icon={dashIcon}
          height={'1.3rem'}
          color={theme.text.colors.primary}
        />
        <Typography> Remove</Typography>
      </PlainButton>
    </div>
  );
};

const LibraryList = () => {
  const notify = useNotification();
  const albumLibrary = useSaveToLibrary('albums');
  const trackLibrary = useSaveToLibrary('tracks');
  const savedAlbums = useSelector((state) => state.library.albums);
  const savedTracks = useSelector((state) => state.library.tracks);
  const albumList = Object.keys(savedAlbums);
  const trackList = Object.keys(savedTracks);
  const albumsQuery = useQuery(
    ['library', 'albums', albumList],
    () => getAlbumsByIdsService(albumList),
    {
      enabled: !!albumList.length,
      keepPreviousData: true,
      select: (res) => res.albums,
      onError: () => notify.error('Error fetching saved albums'),
    }
  );
  const tracksQuery = useQuery(
    ['library', 'tracks', trackList],
    () => getTracksByIdsService(trackList),
    {
      enabled: !!trackList.length,
      keepPreviousData: true,
      select: (res) => res.tracks,
      onError: () => notify.error('Error fetching saved tracks'),
    }
  );

  return (
    <Container>
      <section className="librarySection">
        <Typography as="h1" textStyle="sm18">
          Albums
        </Typography>
        <div role="list" aria-label="saved albums" className="albumsGrid">
          {albumsQuery.data?.map((album) => {
            if (!savedAlbums[album.id]) return null;

            return (
              <LibraryCard
                key={album.id}
                item={album}
                onRemove={() => albumLibrary.remove(album.id)}
              />
            );
          })}
        </div>
        <DataLoader
          isLoading={albumsQuery.isLoading}
          hasData={albumList.length > 0}
          noDataText="You haven't saved any albums yet"
        />
      </section>
      <section className="librarySection">
        <Typography textStyle="sm18">Tracks</Typography>
        <div role="list" aria-label="saved tracks" className="albumsGrid">
          {tracksQuery.data?.map((track) => {
            if (!savedTracks[track.id]) return null;

            return (
              <LibraryCard
                key={track.id}
                item={track}
                onRemove={() => trackLibrary.remove(track.id)}
              />
            );
          })}
        </div>
        <DataLoader
          isLoading={tracksQuery.isLoading}
          hasData={trackList.length > 0}
          noDataText="You haven't saved any tracks yet"
        />
      </section>
    </Container>
  );
};

export default LibraryList;
