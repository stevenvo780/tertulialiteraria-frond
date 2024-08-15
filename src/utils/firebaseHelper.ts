import { auth } from '../utils/firebase';

export const getCurrentUserToken = (): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          resolve(token);
        } catch (error) {
          reject(error);
        }
      } else {
        resolve(null);
      }
      unsubscribe(); // Nos desuscribimos después de recibir el estado del usuario
    });
  });
};
