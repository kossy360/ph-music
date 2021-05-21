import dashIcon from '@iconify-icons/bi/dash';
import plusIcon from '@iconify-icons/bi/plus';
import Icon from '@iconify/react';
import React, { useMemo } from 'react';
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
import { searchTracksService } from '../../services/spotifyService';

const Container = styled.div`
  width: 90%;
  max-width: 80rem;
  margin: auto;
  padding-bottom: 2rem;
  padding-top: 1rem;

  .tableWrapper {
    padding: 2rem 0;
    width: 100%;
  }

  .resultTable {
    width: 100%;
    border-collapse: collapse;

    .searchResultRow {
      td {
        padding: 10px;
        border-bottom: 1px solid #d9dadc;
      }

      .trackAvatar {
        img {
          width: 2rem;
          border-radius: 50%;
        }
      }
    }
  }

  .resultContainerMobile {
    display: grid;
    gap: 1rem;

    .searchResultItem {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid #d9dadc;

      .trackAvatar {
        img {
          width: 4rem;
          border-radius: 50%;
        }
      }

      .details {
        display: grid;
      }
    }
  }
`;

const msToMinutes = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

interface IProps {
  search: string;
}

const SearchResult = (props: IProps) => {
  const { search } = props;
  const theme = useTheme();
  const notify = useNotification();
  const sw = useScreenSize();
  const savedTracks = useSelector((state) => state.library.tracks);
  const { toggleSave } = useSaveToLibrary('tracks');
  const searchResults = useInfiniteQuery(
    ['search', 'tracks', search],
    ({ pageParam = 0 }) =>
      searchTracksService({ q: search, offset: pageParam }),
    {
      enabled: !!search,
      getNextPageParam: (lp) => (lp.tracks.next ? lp.tracks.offset + 1 : false),
      onError: () => notify.error('Error fetching search results'),
    }
  );
  const items = useMemo(() => {
    return searchResults.data?.pages.map((p) => p.tracks.items).flat() ?? [];
  }, [searchResults.data]);

  if (!props.search) return null;

  return (
    <Container>
      <Typography as="h1" textStyle="sm18">
        Search Result
      </Typography>
      <div className="tableWrapper">
        {sw.min(651) && (
          <table aria-label="search results" className="resultTable">
            <tbody>
              {items.map((track) => {
                const isSaved = savedTracks[track.id] ?? false;

                return (
                  <tr key={track.id} className="searchResultRow">
                    <td>
                      <div className="trackAvatar">
                        <img
                          src={
                            track.album.images[0]?.url ??
                            'https://picsum.photos/id/237/200'
                          }
                          alt="album art"
                        />
                      </div>
                    </td>
                    <td>
                      <Typography>{track.name}</Typography>
                    </td>
                    <td>
                      <Typography>{track.album.name}</Typography>
                    </td>
                    <td>
                      <Typography>{msToMinutes(track.duration_ms)}</Typography>
                    </td>
                    <td>
                      <PlainButton onClick={() => toggleSave(track.id)}>
                        <Icon
                          icon={isSaved ? dashIcon : plusIcon}
                          height={'1.3rem'}
                          color={theme.text.colors.primary}
                        />
                      </PlainButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {sw.max(650) && (
          <div
            role="list"
            aria-label="search results"
            className="resultContainerMobile"
          >
            {items.map((track) => {
              const isSaved = savedTracks[track.id] ?? false;

              return (
                <div
                  key={track.id}
                  role="listitem"
                  className="searchResultItem"
                >
                  <div className="trackAvatar">
                    <img
                      src={
                        track.album.images[0]?.url ??
                        'https://picsum.photos/id/237/200'
                      }
                      alt="album art"
                    />
                  </div>
                  <div className="details">
                    <Typography ellipsis>{track.name}</Typography>
                    <Typography ellipsis>{track.album.name}</Typography>
                    <Typography>{msToMinutes(track.duration_ms)}</Typography>
                  </div>
                  <PlainButton onClick={() => toggleSave(track.id)}>
                    <Icon
                      icon={isSaved ? dashIcon : plusIcon}
                      height={'1.3rem'}
                      color={theme.text.colors.primary}
                    />
                  </PlainButton>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <DataLoader
        isLoading={searchResults.isLoading}
        hasData={items.length > 0}
        noDataText="Sorry, no matching tracks were found"
      />
      <LoadMoreButton query={searchResults} />
    </Container>
  );
};

export default SearchResult;
