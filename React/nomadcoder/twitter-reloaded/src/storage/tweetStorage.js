import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../firebase";

export async function uploadTweetImage(images, docId) {
    try {
        const uploadPromises = images.map(async (image) => {
            const uuid = uuidv4();
            const locationRef = ref(storage, `tweets/${docId}/${uuid}`);
            const result = await uploadBytes(locationRef, image);
            const url = await getDownloadURL(result.ref);
            return url;
        });

        const urls = await Promise.all(uploadPromises);
        return urls;
    } catch (error) {
        console.error("Error uploading images:", error);
        throw error;
    }
}
