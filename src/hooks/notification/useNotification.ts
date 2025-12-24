import { useQuery } from "@tanstack/react-query";
import { getAllNotificationByUser } from "../../api/notification/getAllNotificationByUser";
import { getAllNotificationsByUserCandidate } from "../../api/notification/getAllNotificationsByUserCandidate";

export function useOwnerNotifications() {
    return useQuery({
        queryKey: ["notifications_owner"],
        queryFn: getAllNotificationByUser,
    });
}
export function useCandidateNotifications() {
    return useQuery({
        queryKey: ["notifications_candidate"],
        queryFn: getAllNotificationsByUserCandidate,
    });
}
