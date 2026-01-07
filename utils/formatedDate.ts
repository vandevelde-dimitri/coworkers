export const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";

    try {
        // Try parsing the incoming string directly (handles full ISO strings)
        let date = new Date(dateString);

        // If that failed and the string looks like YYYY-MM-DD, try appending time
        if (isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            date = new Date(`${dateString}T00:00:00`);
        }

        // If still invalid, return empty string to avoid throwing
        if (isNaN(date.getTime())) return "";

        return new Intl.DateTimeFormat("fr-FR", {
            month: "long",
            day: "numeric",
        }).format(date);
    } catch (e) {
        // Defensive fallback
        return "";
    }
};
