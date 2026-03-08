import { supabase } from "@/src/infrastructure/supabase";
import { useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../authContext";

type NotificationContextType = {
  notificationCount: number;
  setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
  hasNewNotification: boolean;
};

const NotificationContext = createContext<NotificationContextType>({
  notificationCount: 0,
  setNotificationCount: () => {},
  hasNewNotification: false,
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session } = useAuth();
  const userId = session?.user.id;
  const queryClient = useQueryClient();
  const [notificationCount, setNotificationCount] = useState(0);

  const hasNewNotification = notificationCount > 0;

  useEffect(() => {
    if (!userId) return;

    const fetchCount = async () => {
      const { data } = await supabase.rpc("get_unread_notification_count");
      if (data !== null) setNotificationCount(data);
    };
    fetchCount();

    const channel = supabase
      .channel(`user-notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "participant_requests",
        },
        async (payload) => {
          const { annonce_id } = payload.new;

          const { data: annonce } = await supabase
            .from("annonces")
            .select("user_id")
            .eq("id", annonce_id)
            .single();

          if (annonce?.user_id === userId) {
            setNotificationCount((prev) => prev + 1);
          }
          queryClient.invalidateQueries({
            queryKey: ["notifications", "combined"],
          });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "participant_requests",
        },
        async (payload) => {
          const { annonce_id } = payload.new;

          const { data: annonce } = await supabase
            .from("annonces")
            .select("user_id")
            .eq("id", annonce_id)
            .single();

          if (annonce?.user_id === userId) {
            setNotificationCount((prev) => prev + 1);
          }
          queryClient.invalidateQueries({
            queryKey: ["notifications", "combined"],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <NotificationContext.Provider
      value={{
        notificationCount,
        setNotificationCount,
        hasNewNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationStatus = () => useContext(NotificationContext);
