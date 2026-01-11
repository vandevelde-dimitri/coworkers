export const getAvatarUrl = (
    imageProfile: string | null | undefined,
    avatarUpdatedAt?: string | Date
) => {
    const ts = avatarUpdatedAt
        ? new Date(avatarUpdatedAt).getTime()
        : Date.now();
    return `${imageProfile}?ts=${ts}`;
};
