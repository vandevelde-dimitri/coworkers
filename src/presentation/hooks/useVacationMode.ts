import { useGetSettings } from "./queries/useSettings";

export const useVacationMode = () => {
  const { data: settings } = useGetSettings();
  return !settings?.available;
};
