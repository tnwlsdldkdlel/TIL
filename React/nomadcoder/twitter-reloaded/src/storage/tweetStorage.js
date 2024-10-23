import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../firebase";
import { deleteTweetImageData } from "../api/tweetApi";

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

export async function deleteTweetImage(removeImgages, id) {
    console.log(removeImgages)
    if (removeImgages) {
        removeImgages.forEach(async (image) => {
            // storage 삭제
            const path = decodeURIComponent(image.split("/o/")[1].split("?")[0]);
            const photoRef = ref(storage, path);
            await deleteObject(photoRef);

            // db 삭제
            console.log(image);
            deleteTweetImageData(id, image);
        });
    }

}
