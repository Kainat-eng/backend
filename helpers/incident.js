import { db } from '../firebase.js';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const incidentsCollection = collection(db, 'incidents');

export const createIncident = async ({ serverId, reportedBy, type, description }) => {
  try {
    const newIncident = {
      serverId,
      reportedBy,
      type,                       // Should be validated before calling this
      description,
      status: 'open',             // default
      timestamp: Timestamp.now(),
      resolvedAt: null
    };

    const docRef = await addDoc(incidentsCollection, newIncident);
    console.log('✅ Incident created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating incident:', error);
    throw error;
  }
};
