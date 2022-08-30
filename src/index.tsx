import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDJd20ns1NBW2P7rGP-IT_7GEddu31Ln6g",
  authDomain: "nescol-debias.firebaseapp.com",
  projectId: "nescol-debias",
  storageBucket: "nescol-debias.appspot.com",
  messagingSenderId: "914896776110",
  appId: "1:914896776110:web:dd0a361e1be15b6e8ab63f"
};

const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);