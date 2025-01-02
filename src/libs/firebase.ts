import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: 'AIzaSyAYqF2tLG1bMoNzBMLtOPfoB2Fp_vTrdLU',
  authDomain: 'hulib-9a3ce.firebaseapp.com',
  projectId: 'hulib-9a3ce',
  storageBucket: 'hulib-9a3ce.firebasestorage.app',
  messagingSenderId: '637775863926',
  appId: '1:637775863926:web:bb2fc4dbfc93780fdf7f57',
  measurementId: 'G-FP85CZ4YKP',
};

export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(firebaseApp);
