import * as firebase from 'firebase';
const config = {
    apiKey: "AIzaSyDryA_ItqJdDttBIisjNuyZYHXCWsg2Qzo",
    authDomain: "drift-a9082.firebaseapp.com",
    databaseURL: "https://drift-a9082.firebaseio.com",
    projectId: "drift-a9082",
    storageBucket: "drift-a9082.appspot.com",
    messagingSenderId: "15094020760",
    appId: "1:15094020760:web:71c59279a5ad4f02ed6eed"
}
firebase.initializeApp(config);
const databaseRef = firebase.database().ref();
export const driftsRef = databaseRef.child("drifts")