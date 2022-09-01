import React, { useEffect, useState } from 'react';

import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import SplitPane from 'react-split-pane';
import UserContext from './UserContext';

import './App.css';
import Loader from '../Loader';
import CodePane from '../CodePane';
import NarrativePane from '../NarrativePane';

function logOut() {
  getAuth().signOut();
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [output, setOutput] = useState<string>('');

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
  
  const width = window.innerWidth;
  return (
    <UserContext.Provider value={user}>
      <div className="app w-full h-full">
        {/* @ts-ignore */}
        <SplitPane 
          primary='first' 
          defaultSize='30%' 
          minSize={300} 
          maxSize={width - 800}
          split='vertical'
        >
          <NarrativePane output={output} loading={narrativeLoading} />
          <CodePane setOutput={setOutput} setNarrativeLoading={setNarrativeLoading} />
        </SplitPane>
      </div>
      <div className="fixed bottom-0 left-0 bg-black bg-opacity-30 z-50 p-1">
        Logged in as {user.displayName}. (<button onClick={logOut} className="underline">Not you?</button>)
      </div>
    </UserContext.Provider>
  );
}

export default App;