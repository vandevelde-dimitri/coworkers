import * as FileSystem from "expo-file-system/legacy";

export const uriToArrayBuffer = async (uri: string) => {
    const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
    });

    const binary = atob(base64);
    const len = binary.length;
    const buffer = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        buffer[i] = binary.charCodeAt(i);
    }

    return buffer;
};
