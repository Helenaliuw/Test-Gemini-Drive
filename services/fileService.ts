import { DriveFile } from '../types';
import { db, storage, collection, doc, setDoc, onSnapshot, deleteDoc, updateDoc, query, orderBy, ref, uploadBytes, getDownloadURL, deleteObject } from './firebase';
import { getFileType } from './utils';

/**
 * Listens for real-time updates to a user's files in Firestore.
 * @param uid The user's ID.
 * @param callback A function to call with the updated list of files.
 * @returns An unsubscribe function to stop listening for updates.
 */
export const listenToUserFiles = (uid: string, callback: (files: DriveFile[]) => void) => {
  const filesRef = collection(db, 'users', uid, 'files');
  const q = query(filesRef, orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const files: DriveFile[] = [];
    querySnapshot.forEach((doc) => {
      files.push({ id: doc.id, ...doc.data() } as DriveFile);
    });
    callback(files);
  }, (error) => {
    console.error("Error listening to files:", error);
  });

  return unsubscribe;
};

/**
 * Uploads a file to Firebase Storage and creates a corresponding document in Firestore.
 * @param uid The user's ID.
 * @param file The file object to upload.
 * @param name The name for the file.
 * @param notes Optional user notes for the file.
 */
export const uploadFile = async (uid: string, file: File, name: string, notes: string): Promise<void> => {
  if (!uid) throw new Error("User ID is required for upload.");

  const fileId = crypto.randomUUID();
  const storagePath = `user_uploads/${uid}/${fileId}-${file.name}`;
  const storageRef = ref(storage, storagePath);

  // 1. Upload file to Storage
  const snapshot = await uploadBytes(storageRef, file);
  
  // 2. Get download URL
  const downloadURL = await getDownloadURL(snapshot.ref);

  // 3. Create Firestore document
  const fileDocRef = doc(db, 'users', uid, 'files', fileId);
  
  const now = Date.now();

  const newFileData: Omit<DriveFile, 'id'> = {
    name: name,
    type: getFileType(file.type),
    mimeType: file.type,
    size: file.size,
    download_url: downloadURL,
    storagePath: storagePath,
    createdAt: now,
    updatedAt: now,
    notes: notes,
    aiSummary: '', // Initially empty
  };

  await setDoc(fileDocRef, newFileData);
};

/**
 * Updates a file's metadata in Firestore.
 * @param uid The user's ID.
 * @param fileId The ID of the file to update.
 * @param updates An object with the fields to update.
 */
export const updateUserFile = async (uid: string, fileId: string, updates: Partial<DriveFile>): Promise<void> => {
  const fileDocRef = doc(db, 'users', uid, 'files', fileId);
  await updateDoc(fileDocRef, {
    ...updates,
    updatedAt: Date.now()
  });
};

/**
 * Deletes a file from Firebase Storage and its metadata from Firestore.
 * @param uid The user's ID.
 * @param file The file object to delete.
 */
export const deleteUserFile = async (uid: string, file: DriveFile): Promise<void> => {
  // 1. Delete from Storage
  const storageRef = ref(storage, file.storagePath);
  try {
    await deleteObject(storageRef);
  } catch (error: any) {
    // It's okay if file doesn't exist in storage, maybe it failed to upload before
    if (error.code !== 'storage/object-not-found') {
        console.error("Error deleting from storage:", error);
        throw error;
    }
  }

  // 2. Delete from Firestore
  const fileDocRef = doc(db, 'users', uid, 'files', file.id);
  await deleteDoc(fileDocRef);
};