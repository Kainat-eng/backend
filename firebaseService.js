// firebaseService.js
// firebaseService.js
import { db } from './firebaseAdmin.js'; // Use firestore from admin SDK

export const createDocument = async (collection, docId, data) => {
  try {
    await db.collection(collection).doc(docId).set(data);
    return { success: true };
  } catch (err) {
    console.error(`Error creating document in ${collection}:`, err);
    return { success: false, error: err };
  }
};

// ... keep the rest same (getDocument, updateDocument, deleteDocument, getAllDocuments)

export const getDocument = async (collection, docId) => {
  try {
    const doc = await db.collection(collection).doc(docId).get();
    if (!doc.exists) return null;
    return doc.data();
  } catch (err) {
    console.error(`Error fetching document from ${collection}:`, err);
    return null;
  }
};

export const updateDocument = async (collection, docId, updates) => {
  try {
    await db.collection(collection).doc(docId).update(updates);
    return { success: true };
  } catch (err) {
    console.error(`Error updating document in ${collection}:`, err);
    return { success: false, error: err };
  }
};

export const deleteDocument = async (collection, docId) => {
  try {
    await db.collection(collection).doc(docId).delete();
    return { success: true };
  } catch (err) {
    console.error(`Error deleting document from ${collection}:`, err);
    return { success: false, error: err };
  }
};

export const getAllDocuments = async (collection) => {
  try {
    const snapshot = await db.collection(collection).get();
    const docs = [];
    snapshot.forEach(doc => {
      docs.push({ id: doc.id, ...doc.data() });
    });
    return docs;
  } catch (err) {
    console.error(`Error fetching all documents from ${collection}:`, err);
    return [];
  }
};
