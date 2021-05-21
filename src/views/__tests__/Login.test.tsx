import { startMirage } from '../../test/mirageServer';
import { defaultTestStore } from '../../test/redux';
import { renderWithApp } from '../../test/testRenderer';
import Login from '../Login';

type TMirageServer = ReturnType<typeof startMirage>;
let server: TMirageServer | null = null;

jest.mock('@react-hook/window-size');

beforeEach(() => {
  server = startMirage();
});

afterEach(() => {
  server?.shutdown();
});

describe('Login', () => {
  it('should render properly', async () => {
    const component = renderWithApp(<Login />, {
      store: defaultTestStore(),
      routerProps: { initialEntries: ['/login'] },
    });
    component.getByRole('heading', {
      name: /welcome/i,
    });
    component.getByRole('button', {
      name: /login with spotify/i,
    });
  });
});
