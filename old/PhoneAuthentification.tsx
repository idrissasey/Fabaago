// PhoneAuth.js
import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const PhoneAuthentification = ({ navigation }) => {
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [confirm, setConfirm] = useState(null);
    const [loading, setLoading] = useState(false);

    const signInWithPhoneNumber = async () => {
        if (!phone) return Alert.alert('Erreur', 'Veuillez entrer un numéro valide.');
        try {
            setLoading(true);
            const confirmation = await auth().signInWithPhoneNumber(phone);
            setConfirm(confirmation);
        } catch (error) {
            Alert.alert('Erreur', 'Échec de l\'envoi du SMS.');
        } finally {
            setLoading(false);
        }
    };

    const confirmCode = async () => {
        if (!code) return Alert.alert('Erreur', 'Veuillez entrer le code reçu.');
        try {
            setLoading(true);
            await confirm.confirm(code);
            Alert.alert('Succès', 'Connexion réussie 🎉');
             navigation.navigate('FindRides', { name: 'Jane' });
        } catch (error) {
            Alert.alert('Erreur', 'Code invalide ou expiré.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {!confirm ? (
                <>
                    <Text style={styles.label}>Numéro de téléphone</Text>
                    <TextInput
                        placeholder="+221..."
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                    <Button title="Envoyer le code" onPress={signInWithPhoneNumber} />
                </>
            ) : (
                <>
                    <Text style={styles.label}>Code reçu par SMS</Text>
                    <TextInput
                        placeholder="123456"
                        style={styles.input}
                        value={code}
                        onChangeText={setCode}
                        keyboardType="number-pad"
                    />
                    <Button title="Valider le code" onPress={confirmCode} />
                </>
            )}

            {loading && <ActivityIndicator style={{ marginTop: 20 }} />}

            <View style={{ marginTop: 40 }}>
                <Button
                    title="Accéder au profil de Jane"
                    onPress={() => navigation.navigate('Profile', { name: 'Jane' })}
                />
            </View>
        </View>
    );
};

export default PhoneAuthentification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    label: {
        marginBottom: 6,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
});
