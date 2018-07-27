import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDF57s0tKgYjCc4_rnbAFQAC-hco6gFymo",
    authDomain: "codigo-azul-quito.firebaseapp.com",
    databaseURL: "https://codigo-azul-quito.firebaseio.com",
    projectId: "codigo-azul-quito",
    storageBucket: "codigo-azul-quito.appspot.com",
    messagingSenderId: "659019739684"
};
export const firebaseApp = firebase.initializeApp(config);
export const db = firebaseApp.database();
export const storage = firebaseApp.storage();
export const auth = firebaseApp.auth(); 
export const storageKey = 'KEY_FOR_LOCAL_STORAGE';
export const isAuthenticated = () => {
    return !!auth.currentUser || !!localStorage.getItem(storageKey);
}
export function logout(){
    return auth.signOut();
}
