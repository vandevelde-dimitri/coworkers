let isRecoveryFlow = false;

export const setRecoveryFlow = (value: boolean) => {
  isRecoveryFlow = value;
  if (__DEV__) console.log(`[DeepLinkFlag] isRecoveryFlow = ${value}`);
};

export const getIsRecoveryFlow = () => isRecoveryFlow;
