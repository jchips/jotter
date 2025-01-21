export const setLocalConfigs = (configs) => {
  const serializedState = JSON.stringify(configs);
  localStorage.setItem('configs', serializedState);
};
export const getLocalConfigs = () => {
  let serializedState = localStorage.getItem('configs');
  serializedState = typeof serializedState === 'string' ? JSON.parse(serializedState) : serializedState;
  return serializedState;
};
export const clearLocalConfigs = () => localStorage.removeItem('configs');
