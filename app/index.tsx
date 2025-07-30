import { Link } from "expo-router";
import React from "react";

export default function Index() {
    return (
        <>
            <Link href={"/(tabs)/test"}>Page privée</Link>

            <Link href={"/(public)/test"}>Page publique</Link>
        </>
    );
}
