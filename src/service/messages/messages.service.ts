// src/service/messages/messages.service.ts
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Message {
  uid?: string;
  name: string;
  email: string;
  phone: string;
  details: string;
  status: 'new' | 'seen' | 'replied';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'messages';

// Get all messages
export const getAllMessages = async (): Promise<Message[]> => {
  try {
    const messagesRef = collection(db, COLLECTION_NAME);
    const q = query(messagesRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    })) as Message[];
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw new Error('Failed to fetch messages');
  }
};

// Get messages by status
export const getMessagesByStatus = async (status: 'new' | 'seen' | 'replied'): Promise<Message[]> => {
  try {
    const messagesRef = collection(db, COLLECTION_NAME);
    const q = query(
      messagesRef, 
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    })) as Message[];
  } catch (error) {
    console.error('Error fetching messages by status:', error);
    throw new Error('Failed to fetch messages by status');
  }
};

// Get message by ID
export const getMessageById = async (id: string): Promise<Message | null> => {
  try {
    const messageRef = doc(db, COLLECTION_NAME, id);
    const messageDoc = await getDoc(messageRef);
    
    if (messageDoc.exists()) {
      return {
        uid: messageDoc.id,
        ...messageDoc.data()
      } as Message;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching message:', error);
    throw new Error('Failed to fetch message');
  }
};

// Add new message (from contact form)
export const addMessage = async (messageData: Omit<Message, 'uid' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> => {
  try {
    const messagesRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(messagesRef, {
      ...messageData,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding message:', error);
    throw new Error('Failed to submit message');
  }
};

// Update message status
export const updateMessageStatus = async (id: string, status: 'new' | 'seen' | 'replied'): Promise<void> => {
  try {
    const messageRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(messageRef, {
      status,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    throw new Error('Failed to update message status');
  }
};

// Delete message
export const deleteMessage = async (id: string): Promise<void> => {
  try {
    const messageRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(messageRef);
  } catch (error) {
    console.error('Error deleting message:', error);
    throw new Error('Failed to delete message');
  }
};

// Get unread messages count " not used yet"
export const getUnreadMessagesCount = async (): Promise<number> => {
  try {
    const messagesRef = collection(db, COLLECTION_NAME);
    const q = query(messagesRef, where('status', '==', 'new'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.size;
  } catch (error) {
    console.error('Error fetching unread messages count:', error);
    return 0;
  }
};