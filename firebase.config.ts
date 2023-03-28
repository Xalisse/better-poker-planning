import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: 'AIzaSyApBhFjKzZujr3p8-4l4edlfyovitcIm3M',
    authDomain: 'better-poker-planning.firebaseapp.com',
    projectId: 'better-poker-planning',
    storageBucket: 'better-poker-planning.appspot.com',
    messagingSenderId: '833928737169',
    appId: '1:833928737169:web:eb5da2c6a322b6bc49aa30',
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)

export { firebaseConfig, app, db }
