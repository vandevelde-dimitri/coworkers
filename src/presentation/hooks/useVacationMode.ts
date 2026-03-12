import { useGetSettings } from "./queries/useSettings";

export const useVacationMode = () => {
  const { data: settings } = useGetSettings();
  if (!settings) return false;
  return !settings.available;
};
