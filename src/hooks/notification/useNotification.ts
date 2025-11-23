import { useQuery } from "@tanstack/react-query";
import { getAllNotificationByUser } from "../../api/notification/getAllNotificationByUser";

export function useAllNotificationByUser() {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: getAllNotificationByUser,
    });
}
