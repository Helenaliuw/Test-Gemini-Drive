import { User, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "./firebase";

// This is called on initial user creation to set up their Firestore doc
export const createUserDocument = async (user: User) => {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: Date.now(),
    }, { merge: true }); // Merge true to avoid overwriting existing data if any
};


interface ProfileUpdates {
    displayName?: string;
    photoFile?: File | null; // null means delete
}

export const updateUserProfile = async (updates: ProfileUpdates): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user found.");

    const updatesForAuth: { displayName?: string; photoURL?: string } = {};
    const updatesForFirestore: { displayName?: string; photoURL?: string | null, updatedAt: number } = {
        updatedAt: Date.now()
    };

    if (updates.displayName && updates.displayName !== user.displayName) {
        updatesForAuth.displayName = updates.displayName;
        updatesForFirestore.displayName = updates.displayName;
    }

    if (updates.photoFile) { // If a new file is provided
        const photoPath = `user_uploads/${user.uid}/profile_picture`;
        const photoRef = ref(storage, photoPath);
        await uploadBytes(photoRef, updates.photoFile);
        const downloadURL = await getDownloadURL(photoRef);
        updatesForAuth.photoURL = downloadURL;
        updatesForFirestore.photoURL = downloadURL;
    } else if (updates.photoFile === null) { // If null, it's a request to delete
        const photoPath = `user_uploads/${user.uid}/profile_picture`;
        const photoRef = ref(storage, photoPath);
        try {
            await deleteObject(photoRef);
        } catch (error: any) {
            // Ignore if file doesn't exist
            if (error.code !== 'storage/object-not-found') {
                console.error("Error deleting profile photo:", error);
            }
        }
        updatesForAuth.photoURL = ""; // Firebase Auth uses empty string to remove
        updatesForFirestore.photoURL = null;
    }

    // Update Firebase Auth profile
    if (Object.keys(updatesForAuth).length > 0) {
        await updateProfile(user, updatesForAuth);
    }
    
    // Update Firestore document
    if (Object.keys(updatesForFirestore).length > 1) { // more than just updatedAt
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, updatesForFirestore);
    }
};