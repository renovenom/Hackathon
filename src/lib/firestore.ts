import { collection, doc, setDoc, getDocs, deleteDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { ChatSession } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const saveChatToFirestore = async (userId: string, chat: ChatSession) => {
  const path = `users/${userId}/chats/${chat.id}`;
  try {
    const chatRef = doc(db, 'users', userId, 'chats', chat.id);
    await setDoc(chatRef, chat);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteChatFromFirestore = async (userId: string, chatId: string) => {
  const path = `users/${userId}/chats/${chatId}`;
  try {
    const chatRef = doc(db, 'users', userId, 'chats', chatId);
    await deleteDoc(chatRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const subscribeToChats = (userId: string, callback: (chats: ChatSession[]) => void, onError?: (error: any) => void) => {
  const path = `users/${userId}/chats`;
  const chatsRef = collection(db, 'users', userId, 'chats');
  return onSnapshot(chatsRef, (snapshot) => {
    const chats: ChatSession[] = [];
    snapshot.forEach(doc => {
      chats.push(doc.data() as ChatSession);
    });
    // Sort by updatedAt descending
    chats.sort((a, b) => b.updatedAt - a.updatedAt);
    callback(chats);
  }, (error) => {
    try {
      handleFirestoreError(error, OperationType.GET, path);
    } catch (e) {
      if (onError) onError(e);
    }
  });
};

