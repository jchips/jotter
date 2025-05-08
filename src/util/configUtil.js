export const setLocalConfigs = (configs) => {
  const serializedState = JSON.stringify(configs);
  sessionStorage.setItem('configs', serializedState);
};
export const getLocalConfigs = () => {
  let serializedState = sessionStorage.getItem('configs');
  serializedState = typeof serializedState === 'string' ? JSON.parse(serializedState) : serializedState;
  return serializedState;
};
export const clearLocalConfigs = () => sessionStorage.removeItem('configs');
