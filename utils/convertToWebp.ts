import * as ImageManipulator from "expo-image-manipulator";

export const convertToWebp = async (uri: string) => {
    const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 512 } }],
        {
            compress: 0.8,
            format: ImageManipulator.SaveFormat.WEBP,
        }
    );

    return result.uri;
};
