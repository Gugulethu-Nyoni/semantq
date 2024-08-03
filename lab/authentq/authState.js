const state = {
  isAuthenticated: false,
  user: null,
};

const setIsAuthenticated = (value) => {
  state.isAuthenticated = value;
};

const setUser = (user) => {
  state.user = user;
};

const getIsAuthenticated = () => {
  return state.isAuthenticated;
};

const getUser = () => {
  return state.user;
};

export { setIsAuthenticated, setUser, getIsAuthenticated, getUser };
