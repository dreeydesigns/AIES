export const generateLinkCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No 0, O, 1, I
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

import { db } from './firebase';
import { doc, collection, query, where, getDocs, arrayUnion, writeBatch } from 'firebase/firestore';

export const linkChildByCode = async (parentUid: string, linkCode: string) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('role', '==', 'student'), where('linkCode', '==', linkCode));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("That code doesn't match any student account. Ask your child to check their Settings page for their current code.");
  }

  const studentDoc = querySnapshot.docs[0];
  const studentId = studentDoc.id;

  // Use an atomic batch update
  const batch = writeBatch(db);
  
  const parentRef = doc(db, 'users', parentUid);
  const studentRef = doc(db, 'users', studentId);

  batch.update(parentRef, {
    childIds: arrayUnion(studentId)
  });

  batch.update(studentRef, {
    parentIds: arrayUnion(parentUid)
  });

  await batch.commit();

  return studentId;
};
