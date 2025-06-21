import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    BackHandler,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import firebase from '@react-native-firebase/app';
import {firebaseConfig} from "./config/firebaseConfig.ts";
import auth from '@react-native-firebase/auth';


// Initialize Firebase only if it hasn't been initialized yet
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default function ProfileScreen() {
    const navigation = useNavigation();

    const image = {
        uri: "https://firebasestorage.googleapis.com/v0/b/myapp-a34db.appspot.com/o/images%2Fcategorie1%2F1569483076114?alt=media&token=84a465ea-54ee-4dbf-baf8-3d44da2908ed",
    };

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [dob, setDob] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirm, setConfirm] = useState(null);

    const handleSendCode = async () => {
        if (!phone || !name || !surname || !dob) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }

        try {
            const confirmation = await auth().signInWithPhoneNumber(phone);
            setConfirm(confirmation);
            Alert.alert("Code envoyé", "Veuillez vérifier votre SMS.");
        } catch (error) {
            console.error(error);
            Alert.alert("Erreur", error.message);
        }
    };

    const handleConfirmCode = async () => {
        try {
            await confirm.confirm(otp);
            Alert.alert("Succès", "Inscription réussie !");
            navigation.navigate("Home");
        } catch (error) {
            console.error("Code invalid", error);
            Alert.alert("Erreur", "Code incorrect.");
        }
    };

    const handleCancel = () => {
        Alert.alert("Quitter l’application", "Voulez-vous vraiment quitter ?", [
            { text: "Non", style: "cancel" },
            { text: "Oui", onPress: () => BackHandler.exitApp() },
        ]);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container} edges={["left", "right"]}>
                <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                    <Text style={styles.text}>Bienvenue chez TaxIna !</Text>
                    <Text style={styles.text}>INSCRIPTION</Text>

                    {!confirm ? (
                        <>
                            <TextInput style={styles.input} placeholder="Nom" value={name} onChangeText={setName} />
                            <TextInput style={styles.input} placeholder="Prénom" value={surname} onChangeText={setSurname} />
                            <TextInput style={styles.input} placeholder="Date de Naissance" keyboardType="numeric" value={dob} onChangeText={setDob} />
                            <TextInput style={styles.input} placeholder="Téléphone (+261...)" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={handleSendCode}>
                                    <Text style={styles.buttonText}>Envoyer le code</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                                    <Text style={styles.cancelText}>Annuler</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="Entrer le code SMS"
                                keyboardType="numeric"
                                value={otp}
                                onChangeText={setOtp}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleConfirmCode}>
                                <Text style={styles.buttonText}>Valider le code</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </ImageBackground>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    image: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
    text: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 20,
    },
    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 20,
    },
    button: {
        flex: 1,
        backgroundColor: "#6200ea",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginRight: 10,
    },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    cancelButton: {
        flex: 1,
        backgroundColor: "#ff4444",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    cancelText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
