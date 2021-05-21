import 'react-redux';
import { RootState } from '../store/reducers';

declare module 'react-redux' {
  interface DefaultRootState extends RootState {}
}
