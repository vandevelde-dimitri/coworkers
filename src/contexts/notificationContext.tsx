import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useAuth } from "./authContext";

type NotificationContextType = {
    hasNewNotification: boolean;
    setHasNewNotification: (val: boolean) => void;
};

const NotificationContext = createContext<NotificationContextType>({
    hasNewNotification: false,
    setHasNewNotification: () => {},
});

export const NotificationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { session } = useAuth();
    const userId = session?.user.id;
    const [hasNewNotification, setHasNewNotification] = useState(false);

    useEffect(() => {
        if (!userId) return;

        // 1. Vérification initiale
        const checkUnread = async () => {
            const { data } = await supabase.rpc("get_my_notifications");
            if (data && data.length > 0) setHasNewNotification(true);
        };
        checkUnread();

        // 2. Realtime : On écoute les changements sur participant_requests
        const channel = supabase
            .channel(`user-notifications-${userId}`)
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "participant_requests" },
                async (payload) => {
                    const { new: newRecord, eventType } = payload;

                    // Cas A : Quelqu'un postule à MON annonce
                    const { data: annonce } = await supabase
                        .from("annonces")
                        .select("user_id")
                        .eq("id", newRecord.annonce_id)
                        .single();

                    const isOwner = annonce?.user_id === userId;
                    const isMeCandidate = newRecord.user_id === userId;

                    if (
                        (eventType === "INSERT" && isOwner) ||
                        (eventType === "UPDATE" &&
                            isMeCandidate &&
                            ["accepted", "refused"].includes(newRecord.status))
                    ) {
                        setHasNewNotification(true);
                    }
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    return (
        <NotificationContext.Provider
            value={{ hasNewNotification, setHasNewNotification }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationStatus = () => useContext(NotificationContext);
