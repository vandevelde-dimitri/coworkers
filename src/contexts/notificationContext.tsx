import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useAuth } from "./authContext";

type NotificationContextType = {
    hasNewNotification: boolean;
    clearNotifications: () => void;
};

const NotificationContext = createContext<NotificationContextType>({
    hasNewNotification: false,
    clearNotifications: () => {},
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

        // 🔹 Charger les notifications initiales
        const loadInitialNotifications = async () => {
            try {
                const { data } = await supabase.rpc("get_my_notifications");
                if (data && data.length > 0) {
                    console.log(
                        "[NotificationContext] initial notifications:",
                        data,
                    );
                    setHasNewNotification(true);
                }
            } catch (err) {
                console.error("Erreur load notifications", err);
            }
        };
        loadInitialNotifications();

        // 🔹 Realtime listener
        const channel = supabase
            .channel("notifications-global")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "participant_requests",
                },
                (payload) => {
                    console.log("[Realtime] INSERT detected:", payload);
                    handleNotification(payload.new, "INSERT");
                },
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "participant_requests",
                },
                (payload) => {
                    console.log("[Realtime] UPDATE detected:", payload);
                    handleNotification(payload.new, "UPDATE");
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    // 🔹 Gestion de la bulle
    const handleNotification = async (
        request: any,
        event: "INSERT" | "UPDATE",
    ) => {
        if (!userId) return;

        // 🔹 Récupérer le propriétaire de l'annonce si pas dans le payload
        let annonceOwnerId = request.annonce_owner_id;
        if (!annonceOwnerId) {
            const { data: annonceData, error } = await supabase
                .from("annonces")
                .select("user_id")
                .eq("id", request.annonce_id)
                .single();

            if (error || !annonceData) {
                console.error(
                    "[NotificationContext] failed to fetch annonce:",
                    error,
                );
                return;
            }
            annonceOwnerId = annonceData.user_id;
        }

        const isOwner = annonceOwnerId === userId;
        const isCandidate = request.user_id === userId;

        // 🔹 Log pour debug
        console.log(
            `[NotificationContext] handleNotification | event=${event} | isOwner=${isOwner} | isCandidate=${isCandidate} | status=${request.status}`,
        );

        // 🔹 Déclencher la bulle
        if (
            (event === "INSERT" && isOwner) || // Nouveau candidat → propriétaire
            (event === "UPDATE" &&
                isCandidate &&
                ["accepted", "refused"].includes(request.status)) // Candidat → status accepté ou refusé
        ) {
            setHasNewNotification(true);
        }
    };

    const clearNotifications = () => setHasNewNotification(false);

    return (
        <NotificationContext.Provider
            value={{ hasNewNotification, clearNotifications }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

// 🔹 Hook pour utiliser le contexte
export const useNotificationStatus = () => useContext(NotificationContext);
