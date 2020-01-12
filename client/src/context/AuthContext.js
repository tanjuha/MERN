import { createContext } from 'react';

function noop() {}

export const AuthContext = createContext({
  token: null,
  userd: null,
  login: noop,
  logout: noop,
  isAuthentificated: false
})