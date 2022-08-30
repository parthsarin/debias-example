import React, { useEffect, useState } from 'react';

import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import SplitPane from 'react-split-pane';
import UserContext from './UserContext';

import './App.css';
import Loader from '../Loader';
import CodePane from '../CodePane';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    auth.onAuthStateChanged(async newUser => {
      if (newUser) {
        if (user === null) {
          const db = getFirestore();
          const userData = await getDoc(doc(db, 'users', newUser.uid));

          let updatedUser;
          if (userData.exists()) {
            // Update the user with the information from the database
            updatedUser = { ...newUser, ...userData.data() };
          } else {
            // Create a new document in the database
            setDoc(
              doc(db, 'users', newUser.uid),
              {
                'displayName': newUser.displayName,
                'img': newUser.photoURL,
                'email': newUser.email,
                'uid': newUser.uid
              }
            )
            updatedUser = { ...newUser };
          }

          setUser(updatedUser);
          setLoading(false);
        }
      } else {
        signInWithRedirect(auth, provider);
      }
    });
  });

  if (loading) return <Loader />;
  
  return (
    <UserContext.Provider value={user}>
      <div className="app w-full h-full">
        <SplitPane>
          <div>Welcome {user.displayName}!</div>
          <CodePane />
        </SplitPane>
      </div>
    </UserContext.Provider>
  );
}

export default App;