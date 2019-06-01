import * as firebase from "firebase";
var firebaseConfig = {
  apiKey: "AIzaSyBzJ2wwNvohHWXxM1kO3Rfw4r_jownScdU",
  authDomain: "logintest-1533258605100.firebaseapp.com",
  databaseURL: "https://logintest-1533258605100.firebaseio.com",
  projectId: "logintest-1533258605100",
  storageBucket: "logintest-1533258605100.appspot.com",
  messagingSenderId: "136284331673",
  appId: "1:136284331673:web:5580fee6dd7ca2cb"
};
firebase.initializeApp(firebaseConfig);

//Only using firebase for authenticaton
export function getAuth() {
  return firebase.auth();
}
