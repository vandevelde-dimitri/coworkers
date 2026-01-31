import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) => {
    if (totalPages <= 1) return <View style={{ height: 20 }} />;

    return (
        <View style={styles.container}>
            {/* Bouton Précédent */}
            <TouchableOpacity
                onPress={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={[
                    styles.arrowButton,
                    currentPage === 1 && styles.disabled,
                ]}
            >
                <Text style={styles.arrowText}>{"<"}</Text>
            </TouchableOpacity>

            {/* Numéros de pages */}
            <View style={styles.pagesWrapper}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                        <TouchableOpacity
                            key={pageNum}
                            onPress={() => onPageChange(pageNum)}
                            style={[
                                styles.pageButton,
                                currentPage === pageNum
                                    ? styles.activePage
                                    : styles.inactivePage,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.pageText,
                                    {
                                        color:
                                            currentPage === pageNum
                                                ? "#fff"
                                                : "#374151",
                                    },
                                ]}
                            >
                                {pageNum}
                            </Text>
                        </TouchableOpacity>
                    )
                )}
            </View>

            {/* Bouton Suivant */}
            <TouchableOpacity
                onPress={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                style={[
                    styles.arrowButton,
                    currentPage === totalPages && styles.disabled,
                ]}
            >
                <Text style={styles.arrowText}>{">"}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    pagesWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        maxWidth: "70%",
    },
    arrowButton: {
        padding: 12,
        marginHorizontal: 8,
        borderRadius: 12,
        backgroundColor: "#e5e7eb",
        minWidth: 44,
        alignItems: "center",
    },
    arrowText: {
        fontWeight: "bold",
        fontSize: 16,
    },
    pageButton: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        margin: 4,
        borderRadius: 12,
        minWidth: 40,
        alignItems: "center",
    },
    activePage: {
        backgroundColor: "#2563eb",
    },
    inactivePage: {
        backgroundColor: "#e5e7eb",
    },
    pageText: {
        fontWeight: "600",
    },
    disabled: {
        opacity: 0.4,
    },
});

export default Pagination;
