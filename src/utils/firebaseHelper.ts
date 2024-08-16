import { auth } from '../utils/firebase';

// Obtiene el token del usuario actual
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

// Renueva el token del usuario
export const refreshUserToken = async (): Promise<string | null> => {
  const user = auth.currentUser;

  if (user) {
    try {
      const token = await user.getIdToken(true); // Forzamos la renovación del token
      return token;
    } catch (error) {
      console.error("Error refreshing user token:", error);
      return null;
    }
  } else {
    return null;
  }
};

// Cierra la sesión del usuario
export const signOutUser = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
