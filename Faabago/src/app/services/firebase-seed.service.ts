import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc } from 'firebase/firestore';

@Injectable({
    providedIn: 'root'
})
export class FirebaseSeedService {
    constructor(private firestore: Firestore) {}

    async seedFirestore() {
        try {
            const db = this.firestore;

            const userRef = doc(collection(db, 'users'), 'userId123');
            await setDoc(userRef, {
                user_id: 'user1',
                name: 'Jean Dupont',
                last_name: 'dd ',
                date_birth: new Date(),
                email: 'jean.dupont@email.com',
                tel_nita: '+33612345678',
                password: '0000',
                type_user: 'passager',
                adress: { latitude: 13.5176, longitude: 2.3522 },
                picture: 'uri',
                zone_adress: 'recasement',
                subscribe_date: new Date(),
                average_rate: 4.7,
                cancellation_rate: 0,
                adress_favoris_historic: [
                    { latitude: 13.5176, longitude: 2.3522 },
                    { latitude: 80.8566, longitude: 20.3522 }
                ],

            });

            // 👉 Repeat similarly for drivers, taxis, requests, rides, etc.

            const locationsRef = doc(collection(db,"locations"),"location123");
            await setDoc(locationsRef,
                {
                    "location_id": "location123",
                    "zone_adress": "Recasement",
                    "localisation": { "latitude": 13.8570, "longitude": 2.3510 },
                    "dernière_mise_à_jour": "2024-03-30T15:10:00Z",
                });

            const taxiRef = doc(collection(db, 'taxis'), 'taxiId123');
            await setDoc(taxiRef, {
                taxi_id: 'taxi_work_number_officielCIty', //taxi work ID in city's legislation,unique et ecrit sur le taxi souvent
                number_client_sits: 4,
                driver_id: 'CZsKsuX4eOSA3ebfyvEsOOVLRiJ3',
               // localisation: { latitude: 13.5176, longitude: 2.3522 },
                status: 'disponible',
                picture: 'uri',
                type_taxi: 'berline',
                climatisation: false,
                marqueModel: "Toyota Prius 2020 Hybrid",
                subscribeDate:  new Date().getDate(),
                immatriculation: "AB-123-CD",

            });
            const driverRef = doc(collection(db, 'drivers'), 'driverId123');
            await setDoc(driverRef, {
                user_id: 'driver1',
                name: 'Jean',
                last_name: 'Dupont',
                date_birth: new Date(),
                email: '@444.com',
                tel_nita: '+33612345678',
                type_user: 'conducteur Particulier / Professionnel TAXI',
                adress: { latitude: 13.5176, longitude: 2.3522 },
                picture: 'uri',
                zone_adress: 'recasement',
                subscribe_date: new Date(),
                average_rate: 4.7,
                cancellation_rate: 0,
                status: "en ligne",
                localisation: { latitude: 13.5126, longitude: 1.3522 },
                taxi_licence : "https://firebasestorage.googleapis.com/v0/b/taxina-b3905.firebasestorage.app/o/IUDesignPic%2FGreenPont.png?alt=media&token=6d35978e-d759-4dcc-af21-69a217c7694f",
                driver_licence :"https://firebasestorage.googleapis.com/v0/b/taxina-b3905.firebasestorage.app/o/IUDesignPic%2FGreenPont.png?alt=media&token=6d35978e-d759-4dcc-af21-69a217c7694f",
                number_rides : 350,}
            );



            const rideHistoryRef = doc(collection(db, 'ride_history'), 'rideHistoryId123');
            await setDoc(rideHistoryRef, {
                ride_history_id: 'rideHistory1',
                user_id: 'user1',
                driver_id: 'driver1',
                taxi_id: 'taxi_work_number_officielCIty',
                rides: [
                    {
                        ride_id: 'ride1',
                        status: 'terminé',
                        origin: { latitude: 13.5176, longitude: 2.3522 },
                        destination: { latitude: 13.8570, longitude: 2.3510 },
                        start_time: new Date(),
                        end_time: new Date(),
                        fare: 1500,
                        distance_km: 10,
                    }
                ],
            });
     /* je vais plutot convertir le tableau des reqs en request
            const notificationRef = doc(collection(db, 'request'), 'notificationId123');
            await setDoc(notificationRef, {
                user_id: 'user1',
                title: 'Nouvelle demande de course',
                message: 'Vous avez une nouvelle demande de course.',
                read: false,
                created_at: new Date(),
                type: 'notificationData.type',
                requestId: 'notificationData.requestId',
                from: { latitude: 13.5176, longitude: 2.3522 },
                to: { latitude: 13.5176, longitude: 1.3522 },

            });*/

            // 4️⃣ Ajouter un demnde
            const requestRef = doc(collection(db,"requests"),"request122");
            await setDoc(requestRef,{
                request_id : "request12",
                client_id: "userId123",
                from: { latitude: 48.8566, longitude: 2.3522 },
                to: { latitude: 48.8606, longitude: 2.3376 },
                drivers_notified_Id : "driverId123", // Liste des IDs des drivers notifiés
                comment_depart_zone : " sonuci station rimbo",
                comment_arrival_zone : "recasement premiere laterite plaque salou djibo",
                estimate_price_per_client : 1250,
                lastUpdate: new Date().toISOString(),
                number_client :4,
                estimate_depart_hour: new Date(),
                estimate_arrival_hour : new Date(),
                distance: 19,
                search_zone_distanceKM : 10,
                status: "onWaiting/TakeByDriver"
                //{ // 0.InitCalculateRidesFees-> 1.searchDriver -> 2.waitForDriverResponse -> 3.DriverAccept-> 4.foundDriver ->

            });


            // 4️⃣ Ajouter un trajet
            const rideRef = doc(collection(db,"rides"),"rideId001");
            await setDoc(rideRef,{
                ride_id : "ride12",
                client_id: "userId123",
                driver_id: "driverId456",
                vehicule_id: "vehicleId789",
                point_depart: { latitude: 48.8566, longitude: 2.3522 },
                point_arrivee: { latitude: 48.8606, longitude: 2.3376 },
                distance: 5.2,
                time: 15,
                price_per_client: 1250,
                number_client :4,
                sits_full : true,
                comission_client: 100,
                depart_date: new Date(),
                arrival_date : new Date(),
                status: {  // 5.DriverIsComing -> DriversArrives -> GveConfirmBeginCodeToDriver -> OnRoaad -> Give-ConfirmEngCodes -> Dones
                }
            });


            const paymentRef = doc(collection(db,"payments"),"paymentId456");
            await setDoc(paymentRef,
                {
                    "ride_id": "rideId123",
                    "client_id": "userId123",
                    "driver_id": "driverId456",
                    "ammount": 1350,
                    "payment_type": "carte",
                    "statut": "payé",
                    "date_paiement": new Date("2024-03-30T14:35:00Z")
                });



            const ratingRef = doc(collection(db,"ratings"),"driverId456");
            await setDoc(ratingRef,
                {
                    "ride_id": "rideId123",
                    "client_id": "userId123",
                    "driver_id": "driverId456",
                    "note": 5,
                    "commentaire": "Chauffeur très sympathique et voiture propre !",
                    "date_avis": "2024-03-30T14:40:00Z"
                });



            const support_ticketsRef = doc(collection(db,"support_tickets"),"driverId456");
            await setDoc(support_ticketsRef,
                {
                    "utilisateur_id": "userId123",
                    "sujet": "Problème avec la course",
                    "description": "Le tarif facturé est plus élevé que prévu.",
                    "statut": "en cours",
                    "date_creation": "2024-03-30T15:00:00Z"
                });




            const promotionsRef = doc(collection(db,"promotions"),"driverId456");
            await setDoc(promotionsRef,
                {
                    "code": "UBER10",
                    "description": "Réduction de 10% sur la prochaine course.",
                    "montant_remise": 10,
                    "date_expiration": "2024-06-30T23:59:59Z",
                    "nombre_utilisations_max": 1000,
                    "nombre_utilisations_actuelles": 350
                });





            console.log('✅ Firestore rempli avec succès !');
        } catch (error) {
            console.error('❌ Erreur lors de l’ajout des données :', error);
        }
    }
}
