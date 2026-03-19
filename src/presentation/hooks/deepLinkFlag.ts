// Simple module-level flag for deep link recovery flow
// No React overhead, no context provider needed

let isRecoveryFlow = false;

export const setRecoveryFlow = (value: boolean) => {
  isRecoveryFlow = value;
  if (__DEV__) console.log(`[DeepLinkFlag] isRecoveryFlow = ${value}`);
};

export const getIsRecoveryFlow = () => isRecoveryFlow;
