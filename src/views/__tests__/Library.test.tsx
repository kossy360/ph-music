import { useWindowWidth } from '@react-hook/window-size';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { setLibraryDataAction } from '../../store/actions/libraryActions';
import { startMirage } from '../../test/mirageServer';
import { authenticatedTestStore } from '../../test/redux';
import { renderWithApp } from '../../test/testRenderer';
import Library from '../Library';
import TopBar from '../Library/TopBar';

const setScreenSize = (size: number) => {
  return (
    useWindowWidth as jest.MockedFunction<typeof useWindowWidth>
  ).mockImplementation(() => size);
};

type TMirageServer = ReturnType<typeof startMirage>;
let server: TMirageServer | null = null;

jest.mock('@react-hook/window-size');

beforeEach(() => {
  server = startMirage();
});

afterEach(() => {
  server?.shutdown();
});

describe('Top navigator', () => {
  it('should render properly (desktop)', async () => {
    setScreenSize(1500);
    const component = renderWithApp(<TopBar />, {
      store: authenticatedTestStore(),
      routerProps: { initialEntries: ['/'] },
    });
    component.getByRole('img', {
      name: /user avatar/i,
    });
    component.getByRole('button', {
      name: /export to my spotify/i,
    });
    component.getByText(/my library/i);
    component.getByRole('button', {
      name: /search/i,
    });
    component.getByRole('button', {
      name: /logout button/i,
    });
  });

  it('should render properly (mobile)', async () => {
    setScreenSize(400);
    const component = renderWithApp(<TopBar />, {
      store: authenticatedTestStore(),
      routerProps: { initialEntries: ['/'] },
    });
    const menuButton = component.getByRole('button', {
      name: /open drawer/i,
    });

    fireEvent.click(menuButton);

    await waitFor(() =>
      component.getByRole('navigation', { name: /app drawer/! })
    );

    component.getByRole('img', {
      name: /user avatar/i,
    });
    component.getByRole('button', {
      name: /export to my spotify/i,
    });
    component.getByRole('button', {
      name: /search/i,
    });
    component.getByRole('button', {
      name: /logout/i,
    });

    const closeButton = component.getByRole('button', { name: /close menu/! });

    fireEvent.click(closeButton);

    expect(
      component.queryByRole('navigation', { name: /app drawer/! })
    ).toBeNull();
  });
});

describe('Export form', () => {
  it('should render properly', async () => {
    setScreenSize(1500);
    const component = renderWithApp(<TopBar />, {
      store: authenticatedTestStore(),
      routerProps: { initialEntries: ['/'] },
    });

    const openFormButton = component.getByRole('button', {
      name: /export to my spotify/i,
    });

    fireEvent.click(openFormButton);

    const form = await waitFor(() =>
      screen.getByRole('form', { name: /export to library form/i })
    );

    within(form).getByRole('button', { name: /export/i });
    expect(within(form).getAllByRole('textbox').length).toEqual(2);

    const closeButton = screen.getByRole('button', { name: /close form/i });

    fireEvent.click(closeButton);

    expect(
      screen.queryByRole('form', { name: /export to library form/i })
    ).toBeNull();
  });
});

describe('Library', () => {
  it('should render all items', async () => {
    setScreenSize(1500);
    const store = authenticatedTestStore();
    const albums = server!.createList('spotifyAlbum', 5).map((m) => m.album);
    const tracks = server!.createList('spotifyTrack', 7).map((m) => m.track);

    store.dispatch(
      setLibraryDataAction({
        tracks: tracks.reduce((acc, curr) => {
          acc[curr.id] = true;
          return acc;
        }, {} as Record<string, true>),
        albums: albums.reduce((acc, curr) => {
          acc[curr.id] = true;
          return acc;
        }, {} as Record<string, true>),
      })
    );

    const component = renderWithApp(<Library />, {
      store,
      routerProps: { initialEntries: ['/'] },
    });
    const albumsList = component.getByRole('list', { name: /saved albums/i });
    const tracksList = component.getByRole('list', { name: /saved tracks/i });
    const albumCards = await waitFor(() =>
      within(albumsList).getAllByRole('listitem')
    );
    const trackCards = await waitFor(() =>
      within(tracksList).getAllByRole('listitem')
    );

    expect(albumCards.length).toBe(albums.length);
    expect(trackCards.length).toBe(tracks.length);
  });
});
