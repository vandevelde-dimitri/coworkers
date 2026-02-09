export const RequestParticipant = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    REFUSED: "refused",
    ANNOUNCEMENT_CANCEL: "announce_deleted",
    REMOVE_BY_OWNER: "removed_by_owner",
} as const;

export type RequestParticipant =
    (typeof RequestParticipant)[keyof typeof RequestParticipant];
