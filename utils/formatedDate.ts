export const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("fr-FR", {
        month: "long",
        day: "numeric",
    }).format(new Date(`${dateString}T00:00:00`));
};
