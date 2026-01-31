export const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";

    try {
        let date = new Date(dateString);

        if (isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            date = new Date(`${dateString}T00:00:00`);
        }

        if (isNaN(date.getTime())) return "";

        return new Intl.DateTimeFormat("fr-FR", {
            month: "long",
            day: "numeric",
        }).format(date);
    } catch (e) {
        return "";
    }
};
