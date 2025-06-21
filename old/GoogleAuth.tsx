// GoogleAuth.js
import React, { useEffect } from 'react';
import { Button } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export default function GoogleAuth() {
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: 'TON_WEB_CLIENT_ID_FIREBASE',
        });
    }, []);

    const onGoogleButtonPress = async () => {
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        await auth().signInWithCredential(googleCredential);
        alert('Connecté avec Google ✅');
    };

    return <Button title="Se connecter avec Google" onPress={onGoogleButtonPress} />;
}
