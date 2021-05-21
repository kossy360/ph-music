import { useWindowWidth } from '@react-hook/window-size';
import { fireEvent, waitFor, within } from '@testing-library/react';
import { startMirage } from '../../test/mirageServer';
import { authenticatedTestStore } from '../../test/redux';
import { renderWithApp } from '../../test/testRenderer';
import Home from '../Home';
import NewReleases from '../Home/NewReleases';
import SearchResult from '../Home/SeachResult';
import TopBar from '../Home/TopBar';

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
    // set screen width
    (
      useWindowWidth as jest.MockedFunction<typeof useWindowWidth>
    ).mockImplementation(() => 1200);

    const component = renderWithApp(<TopBar onSearchChange={() => {}} />, {
      store: authenticatedTestStore(),
      routerProps: { initialEntries: ['/'] },
    });

    const avatar = component.getByRole('img', {
      name: /user avatar/i,
    });
    const input = component.getByRole('textbox', {
      name: /search field/i,
    });
    const libraryLink = component.getByText(/my library/i);
    const logoutButton = component.getByRole('button', {
      name: /logout button/i,
    });

    expect(avatar).toBeDefined();
    expect(input).toBeDefined();
    expect(libraryLink).toBeDefined();
    expect(logoutButton).toBeDefined();
  });

  it('should render properly (mobile)', async () => {
    // set screen width
    (
      useWindowWidth as jest.MockedFunction<typeof useWindowWidth>
    ).mockImplementation(() => 400);

    const component = renderWithApp(<TopBar onSearchChange={() => {}} />, {
      store: authenticatedTestStore(),
      routerProps: { initialEntries: ['/'] },
    });
    const menuButton = component.getByRole('button', {
      name: /open menu/i,
    });

    component.getByRole('textbox', {
      name: /search field/i,
    });
    fireEvent.click(menuButton);

    await waitFor(() =>
      component.getByRole('navigation', { name: /app drawer/! })
    );

    component.getByRole('img', {
      name: /user avatar/i,
    });
    component.getByText(/my library/i);
    component.getByText(/logout/i);

    const closeButton = component.getByRole('button', { name: /close menu/! });

    fireEvent.click(closeButton);

    expect(
      component.queryByRole('navigation', { name: /app drawer/! })
    ).toBeNull();
  });
});

describe('New releases section', () => {
  it('should render all items', async () => {
    const data = server!.createList('spotifyAlbum', 5).map((m) => m.album);
    const component = renderWithApp(<NewReleases isSearching={false} />, {
      store: authenticatedTestStore(),
      routerProps: { initialEntries: ['/'] },
    });
    const listbox = component.getByRole('list', {
      name: /album list/i,
    });
    const albums = await waitFor(() => component.getAllByRole('listitem'));

    expect(listbox).toBeDefined();
    expect(albums.length).toEqual(data.length);
  });

  it('should render only 4 items when searching', async () => {
    server!.createList('spotifyAlbum', 10).map((m) => m.album);
    const component = renderWithApp(<NewReleases isSearching={true} />, {
      store: authenticatedTestStore(),
      routerProps: { initialEntries: ['/'] },
    });
    const listbox = component.getByRole('list', {
      name: /album list/i,
    });
    const albums = await waitFor(() => component.getAllByRole('listitem'));

    expect(listbox).toBeDefined();
    expect(albums.length).toEqual(4);
  });

  it('should not render when searching on mobile screens', async () => {
    server!.createList('spotifyAlbum', 10).map((m) => m.album);
    (
      useWindowWidth as jest.MockedFunction<typeof useWindowWidth>
    ).mockImplementation(() => 400);

    const component = renderWithApp(<NewReleases isSearching={true} />, {
      store: authenticatedTestStore(),
      routerProps: { initialEntries: ['/'] },
    });

    const listbox = component.queryByRole('list', {
      name: /album list/i,
    });

    expect(listbox).toBeNull();
  });
});

describe('Search results section', () => {
  it('should render table on large screens', async () => {
    setScreenSize(1200);
    const data = server!.createList('spotifyTrack', 10).map((m) => m.track);
    const component = renderWithApp(<SearchResult search="search" />, {
      store: authenticatedTestStore(),
      routerProps: { initialEntries: ['/'] },
    });
    const table = component.getByRole('table');
    const tracks = await waitFor(() => within(table).getAllByRole('row'));
    const firstTrack = tracks[0];

    within(firstTrack).getByText(data[0].name);

    expect(tracks.length).toEqual(data.length);
  });

  it('should render table on mobile screens', async () => {
    setScreenSize(400);
    const data = server!.createList('spotifyTrack', 10).map((m) => m.track);
    const component = renderWithApp(<SearchResult search="search" />, {
      store: authenticatedTestStore(),
      routerProps: { initialEntries: ['/'] },
    });
    const listbox = component.getByRole('list', {
      name: /search results/i,
    });
    const tracks = await waitFor(() =>
      within(listbox).getAllByRole('listitem')
    );
    const firstTrack = tracks[0];

    within(firstTrack).getAllByText(data[0].name);
    expect(listbox).toBeDefined();
    expect(tracks.length).toEqual(data.length);
  });
});

describe('Home Screen', () => {
  it('should render table on large screens', async () => {
    setScreenSize(1500);
    const trackData = server!
      .createList('spotifyTrack', 10)
      .map((m) => m.track);
    const albumData = server!
      .createList('spotifyAlbum', 10)
      .map((m) => m.album);
    const component = renderWithApp(<Home />, {
      store: authenticatedTestStore(),
      routerProps: { initialEntries: ['/'] },
    });
    const albumSection = component.getByRole('list', { name: /album list/i });
    const albumItems = await waitFor(() => component.getAllByRole('listitem'));

    expect(albumItems.length).toEqual(albumData.length);
    expect(
      component.queryByRole('table', { name: /search results/i })
    ).toBeNull();

    const searchField = component.getByRole('textbox', {
      name: /search field/i,
    });

    fireEvent.change(searchField, { target: { value: 'search' } });

    const searchResultsTable = await waitFor(() =>
      component.getByRole('table', { name: /search results/i })
    );
    const searchResults = await waitFor(() =>
      within(searchResultsTable).getAllByRole('row')
    );

    expect(searchResults.length).toEqual(trackData.length);
    expect(within(albumSection).getAllByRole('listitem').length).toEqual(4);

    // switch to mobile
    setScreenSize(400);
    component.rerender(<Home />);

    expect(component.queryByRole('list', { name: /album list/i })).toBeNull();
  });
});
