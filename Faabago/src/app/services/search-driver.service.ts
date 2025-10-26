import { Injectable } from '@angular/core';
import {
    collection, doc, DocumentData, DocumentReference,
    Firestore,
    GeoPoint,
    getDocs,
    getFirestore,
    query, setDoc,
    where
} from 'firebase/firestore';
import {firstValueFrom, from} from 'rxjs';
import {RequestPopupComponent} from "../components/driver-request-popup/driver-request-popup.component";
import { Router } from '@angular/router';
import {NavController} from "@ionic/angular";
import {MatDialog}  from '@angular/material/dialog'

export const LOCATIONS = [
    // Niamey I
    { name: 'Bobiel', arrondissement: 'Niamey I', coords: { lat: 13.54, lng: 2.12 } },
    { name: 'Cité Chinoise', arrondissement: 'Niamey I', coords: { lat: 13.532, lng: 2.11 } },
    { name: 'Cité Francophonie', arrondissement: 'Niamey I', coords: { lat: 13.53, lng: 2.112 } },
    { name: 'Koira Kano', arrondissement: 'Niamey I', coords: { lat: 13.529, lng: 2.107 } },
    { name: 'Goudel', arrondissement: 'Niamey I', coords: { lat: 13.48, lng: 2.12 } },
    { name: 'Koubia', arrondissement: 'Niamey I', coords: { lat: 13.533, lng: 2.115 } },
    { name: 'Yantala Haut', arrondissement: 'Niamey I', coords: { lat: 13.55, lng: 2.11 } },
    { name: 'Yantala Bas', arrondissement: 'Niamey I', coords: { lat: 13.545, lng: 2.11 } },
    { name: 'Plateau I', arrondissement: 'Niamey I', coords: { lat: 13.535, lng: 2.105 } },
    { name: 'Riyad', arrondissement: 'Niamey I', coords: { lat: 13.532, lng: 2.108 } },
    { name: 'Sabara', arrondissement: 'Niamey I', coords: { lat: 13.526, lng: 2.112 } },
    { name: 'Terminus', arrondissement: 'Niamey I', coords: { lat: 13.522, lng: 2.116 } },
    { name: 'Karadjé', arrondissement: 'Niamey I', coords: { lat: 13.538, lng: 2.119 } },
    { name: 'Gamkalé', arrondissement: 'Niamey I', coords: { lat: 13.514, lng: 2.127 } },

    // Niamey II
    { name: 'Boukoki I', arrondissement: 'Niamey II', coords: { lat: 13.51, lng: 2.115 } },
    { name: 'Boukoki II', arrondissement: 'Niamey II', coords: { lat: 13.51, lng: 2.12 } },
    { name: 'Lazaret', arrondissement: 'Niamey II', coords: { lat: 13.52, lng: 2.11 } },
    { name: 'Kouré', arrondissement: 'Niamey II', coords: { lat: 13.515, lng: 2.122 } },
    { name: 'Gaweye', arrondissement: 'Niamey II', coords: { lat: 13.516, lng: 2.11 } },

    // Niamey III
    { name: 'Kalley Centre', arrondissement: 'Niamey III', coords: { lat: 13.51, lng: 2.105 } },
    { name: 'Madina', arrondissement: 'Niamey III', coords: { lat: 13.52, lng: 2.09 } },
    { name: 'Banizoumbou', arrondissement: 'Niamey III', coords: { lat: 13.5, lng: 2.14 } },
    { name: 'Harobanda', arrondissement: 'Niamey III', coords: { lat: 13.506, lng: 2.099 } },
    { name: 'Diori', arrondissement: 'Niamey III', coords: { lat: 13.51, lng: 2.1 } },

    // Niamey IV
    { name: 'Aéroport I', arrondissement: 'Niamey IV', coords: { lat: 13.48, lng: 2.133 } },
    { name: 'Aéroport II', arrondissement: 'Niamey IV', coords: { lat: 13.479, lng: 2.14 } },
    { name: 'Saga Goungou', arrondissement: 'Niamey IV', coords: { lat: 13.47, lng: 2.14 } },
    { name: 'Talladjé', arrondissement: 'Niamey IV', coords: { lat: 13.46, lng: 2.12 } },
    { name: 'Pays Bas I', arrondissement: 'Niamey IV', coords: { lat: 13.46, lng: 2.135 } },
    { name: 'Pays Bas II', arrondissement: 'Niamey IV', coords: { lat: 13.458, lng: 2.137 } },
    { name: 'Dar-es-Salam', arrondissement: 'Niamey IV', coords: { lat: 13.465, lng: 2.129 } },
    { name: 'Kandadji', arrondissement: 'Niamey IV', coords: { lat: 13.472, lng: 2.136 } },

    // Périphérie (20 km autour de Niamey)
    { name: 'Liboré', arrondissement: 'Périphérie', coords: { lat: 13.35, lng: 2.18 } },
    { name: 'Kollo', arrondissement: 'Périphérie', coords: { lat: 13.3, lng: 2.183 } },
    { name: 'Sadoré', arrondissement: 'Périphérie', coords: { lat: 13.33, lng: 2.25 } },
    { name: 'Kouré', arrondissement: 'Périphérie', coords: { lat: 13.25, lng: 2.45 } },
    { name: 'Boubon', arrondissement: 'Périphérie', coords: { lat: 13.63, lng: 2.2 } },
    { name: 'Saguia', arrondissement: 'Périphérie', coords: { lat: 13.47, lng: 2.03 } },
    { name: 'Karma', arrondissement: 'Périphérie', coords: { lat: 13.58, lng: 2.02 } },
    { name: 'Bitinkodji', arrondissement: 'Périphérie', coords: { lat: 13.36, lng: 2.13 } },
    { name: 'Kountché', arrondissement: 'Périphérie', coords: { lat: 13.48, lng: 2.00 } },
    { name: 'Saye', arrondissement: 'Périphérie', coords: { lat: 13.61, lng: 2.19 } },
    { name: 'Gorou Kirey', arrondissement: 'Périphérie', coords: { lat: 13.61, lng: 2.14 } }
];


type Quartier = {
    name: string;
    arrondissement: string;
    coords: {
        lat: number;
        lng: number;
    };
};





interface DriverResponse {
    accepted: boolean;
    driverId: string;
}

interface Driver
{
    user_id: string;
    name: string;
    last_name: string;
    date_birth: Date;
    email: string;
    tel_nita: string;
    type_user: string;
    adress: GeoPoint;
    picture: string;
    zone_adress: string;
    subscribe_date: Date;
    average_rate: number;
    cancellation_rate: number;
    adress_historic: GeoPoint[];
    password?: string; // Optional field for password
    localisation?: GeoPoint; // Optional field for driver's current location
}

export interface Request {
    request_id: string;
    from: GeoPoint;
    to: GeoPoint;
    number_client: number;
    status: string;
    client_id: string;
    drivers_notified_Id: string[];
    driver_accepted_Id?: string; // Optional, ID of the driver who accepted
    created_at: Date;

    comment_depart_zone: string;
    comment_arrival_zone: string;
    estimate_price_per_client: number;
    lastUpdate: string;

    estimate_depart_hour: Date;
    estimate_arrival_hour: Date;
    distance: number;
    search_zone_distanceKM: number;

}

interface Ride {
    ride_id: string;
    from: GeoPoint;
    to: GeoPoint;
    distance: number;
    estimated_price: number;
    driver_id: string;
    client_id: string;
    status: string;

    [key: string]: any;
}

export interface Taxi {


    taxi_id?: string; // Identifiant unique du taxi
    number_client_sits: number; // Nombre de places
    driver_id: string; // ID du chauffeur
    localisation?: GeoPoint; // Position actuelle
    status: string; // Statut du taxi
    picture?: string; // Photo du taxi
    type_taxi?: string; // Type de taxi
    climatisation?: boolean; // Climatisation
    marqueModel?: string; // Marque et modèle
    subscribeDate?: Date; // Date d'inscription
    immatriculation?: string; // Immatriculation

}

export interface DriverResult {
    driver: Driver;
    taxi: Taxi;
    distanceToClient: number;
    rideDistance: number;
    estimatedPrice: number;
}

@Injectable({providedIn: 'root'})
export class SearchDriverService {




notifyDriver(driverId: string, notificationData: {
    type: string;
    requestId: string;
    message: string;
    from: { lat: number; lng: number } | null;
    to: { lat: number; lng: number } | null;
}) {
    try {
        alert('Envoi notification to driver ' + driverId + ' with data: ' + JSON.stringify(notificationData));
        const notificationRef = doc(this._db, 'notifications', driverId);

        const notificationPayload = {
            user_id: 'user1',
            title: 'Nouvelle demande de course',
            read: false,
            type: notificationData.type,
            requestId: notificationData.requestId,
            message: notificationData.message,
            from: notificationData.from,
            to: notificationData.to,
            created_at: new Date().toISOString(),
        };

        setDoc(notificationRef, notificationPayload, { merge: true })
            .then(() => {
                console.log(`Notification envoyée au conducteur ${driverId}:`, notificationPayload);
                return true;
            })
            .catch((error) => {
                console.error(`Erreur lors de l'envoi de la notification au conducteur ${driverId}:`, error);
                return false;
            });
    } catch (error) {
        console.error('Erreur dans notifyDriver:', error);
        return false;
    }
    return false;
}


    /**
     * Trouve un quartier par son nom
     * @param name Nom du quartier à chercher
     * @param locations Tableau de quartiers
     * @param returnCoords Si true, retourne uniquement les coordonnées
     * @returns Quartier complet ou coordonnées (lat, lng), ou undefined
     */
     getQuartier(
        name: string,
        locations: Quartier[],
        returnCoords: boolean = false
    ): Quartier | { latitude: number; longitude: number } | undefined {
        const found = locations.find(loc => loc.name.toLowerCase() === name.toLowerCase());
        if (!found) return undefined;

        return returnCoords
            ? { latitude: found.coords.lat, longitude: found.coords.lng }
            : found;
    }

    get MAX_DISTANCE_KM(): number {
        return this._MAX_DISTANCE_KM;
    }

    set MAX_DISTANCE_KM(value: number) {
        this._MAX_DISTANCE_KM = value;
    }

    get BASE_PRICE_USED(): number {
        return this._BASE_PRICE_USED;
    }

    set BASE_PRICE_USED(value: number) {
        this._BASE_PRICE_USED = value;
    }

    get PRICE_PER_KM(): number {
        return this._PRICE_PER_KM;
    }

    set PRICE_PER_KM(value: number) {
        this._PRICE_PER_KM = value;
    }
    get db(): Firestore {
        return this._db;
    }

    set db(value: Firestore) {
        this._db = value;
    }
    private _MAX_DISTANCE_KM = 30;
    private _BASE_PRICE_TAXI = 800;
    private _BONUS_PRICE_CLIM = 1000;
    private _BASE_PRICE_ChauffeurPerso = 1500;
    private _PRICE_PER_KM = 100;
    private _BASE_PRICE_USED = 0;
    private _db = getFirestore(); // Utiliser getFirestore pour obtenir l'instance Firestore




    constructor( private navCtrl: NavController, private dialog: MatDialog) {}


    //METOHODE LOURDE A ALEGER OU SIMPLIFIER
    async findAvailableDrivers(from: { latitude: number; longitude: number },
                               to: { latitude: number; longitude: number },
                               numberClient: number
    ) : Promise<DriverResult[]> {
        const results: DriverResult[] = [];

        try {
            const driversQuery = query(
                collection(this._db, 'drivers'),
                where('status', '==', 'en ligne')
            );

            const driversSnap = await getDocs(driversQuery);
            console.log(driversSnap.size , " driversSnap size");
            for (const docSnap of driversSnap.docs) {
                console.log("docSnap : ", docSnap.data());
                const driver = docSnap.data() as Driver;
                const localisation = driver.localisation
                    ? { latitude: driver.localisation.latitude, longitude: driver.localisation.longitude }
                    : undefined;
               // const data = docSnap.data();
                console.log("drivver find " ,driver , "snapp     : " ,  "  driver localisation : " , localisation);

                // distance entre le conducteur et le client
                const distanceToClient = this.haversineDistance(from, localisation);
                console.log( "driver : ", driver , "from : ", from," localisation driver : ", localisation, " distanceToClient : mooon ", distanceToClient);
                console.log(`[SearchDriverService] Driver ID: ${driver.user_id}, Distance to client: ${distanceToClient} km`);

                //TODO AJOUTER LORS DE L4INSCRIPTION LE TAXI EN BASE DE0 DONNEE
                // TODO DEMANDER AU CLIENT LE TYPE DE TAXI SOUHAITE (NB PLACE, TAXI ou PERSO, CLIM OU PAS, ETC)
                if (distanceToClient <= this._MAX_DISTANCE_KM) {
                    console.log("AQJK ESTA IF MAXDISRAN " + driver.user_id);
                    const taxisQuery = query(
                        collection(this._db, 'taxis'),
                        where('driver_id', '==', driver.user_id)
                    );

                    const taxiSnap = await getDocs(taxisQuery);
                    if (taxiSnap.empty) {
                        console.log("Aucun taxi trouvé pour le conducteur", driver.user_id);
                        continue; // Passe au conducteur suivant
                    }
                    const taxi = taxiSnap.docs[0]?.data() as Taxi;
                    console.log(taxiSnap);
                    console.log("AQJK ES TAXI", taxi, "taxi nbplace", taxi.number_client_sits, "numberClient", numberClient);
                    if(driver.type_user === 'classic'){
                        this._BASE_PRICE_USED = this._BASE_PRICE_TAXI;
                    }else if(driver.type_user === 'private'){
                        this._BASE_PRICE_USED = this._BASE_PRICE_ChauffeurPerso;
                    }


                    console.log("AQJK ESTA IF 111155555555444444444422222222");
                    if (taxi && taxi.number_client_sits >= numberClient) {

                        console.log("taxi nbplace get " , taxi.number_client_sits , "numberClient ", numberClient);

                        // Appliquer le bonus si le taxi a la climatisation pour vehicule perso et taxi
                        if (taxi.climatisation) {
                            this._BASE_PRICE_USED = this._BASE_PRICE_USED + this._BONUS_PRICE_CLIM;
                        }

                        // console.log("AQJK ESTA IF 111155555555444444444422222222");

                        // distance entre le point de prise en charge et la destination
                        const rideDistance = this.haversineDistance(from, to);
                        // prix estimé de la course
                        const estimatedPrice = this.estimatePrice(rideDistance, numberClient);

                        results.push({
                            driver,
                            taxi,
                            distanceToClient,
                            rideDistance,
                            estimatedPrice,
                        });

                        console.log(`[SearchDriverService] Driver ID: ${driver.user_id}, Estimated Price: ${estimatedPrice} XAF`,  results);

                    }else{
                        console.log("PAS ASSEZ DE PLACE DANS LE TAXI");
                    }
                }
            }

            return results;
        } catch (error) {
            console.error('[SearchDriverService] Error:', error);
            return [];
        }
    }

    private haversineDistance(coord1: { latitude: number; longitude: number }, coord2: { latitude: number; longitude: number } | undefined): number {
        if (!coord2) {
            console.error('coord2 est undefined');
            return Infinity; // Retournez une valeur par défaut (par exemple, Infinity) si coord2 est undefined
        }

        const toRad = (value: number) => (value * Math.PI) / 180;
        const R = 6371; // Rayon de la Terre en km
        const dLat = toRad(coord2.latitude - coord1.latitude);
        const dLon = toRad(coord2.longitude - coord1.longitude);
        const lat1 = toRad(coord1.latitude);
        const lat2 = toRad(coord2.latitude);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }


    // Elle additionne un prix de base, puis ajoute le coût proportionnel à la distance, réparti entre le nombre de clients.
    // Cela correspond à une logique courante pour le calcul du tarif d’une course partagée.
    private estimatePrice(distance: number, nbClients: number): number {
        return this._BASE_PRICE_USED + ((distance * this._PRICE_PER_KM) / nbClients);
    }

    async waitForDriverResponse(
        driversNotified: string[],
        requestRef: DocumentReference<DocumentData, DocumentData>,
        p0: number,
        p1: () => void,
    ): Promise<DriverResponse> {



        const driversQuery = query(
            collection(this._db, 'drivers'),
            where('user_id', 'in', driversNotified),
            where('status', '==', 'en ligne')
        );
        const driversSnap = await getDocs(driversQuery);
        const drivers: Driver[] = driversSnap.docs.map(doc => doc.data() as Driver);
        console.log( "driversSnap size waitForDriverResponse : ", driversSnap.size, " drivers : ", drivers);
        if (drivers.length === 0) {
            throw new Error('Aucun conducteur en ligne trouvé dans la liste fournie');
        }

        const userId = localStorage.getItem('userId');

        let driverId = userId;

        // Envoie le popup à tous les conducteurs et attend la première acceptation
        return new Promise<DriverResponse>((resolve, reject) => {
            let resolved = false;
            let timeout = setTimeout(() => {
                if (!resolved) reject(new Error('Délai dépassé'));
            }, 30000);

            drivers.forEach(driver => {
                console.log( resolved , "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", driver.type_user , " driverId : ", driverId , " userId : ", driver.user_id);
                if(driver.user_id === driverId){// Eviter d'envoyer la demande au conducteur qui a initié la requête ou au user classique
                this.handleDriverRequest(requestRef, driver)
                    .then(() => {
                        if (!resolved) {
                            resolved = true;
                            clearTimeout(timeout);
                            resolve({ accepted: true, driverId: driver.user_id });
                        }
                    })
                    .catch(() => {
                        // Ignorer les erreurs individuelles
                    });}
            });

        });
    }



    async handleDriverRequest(
        requestRef: DocumentReference<DocumentData, DocumentData>,
        driver: Driver
    ): Promise<void> {



        let userProfile = driver.type_user;
        if (userProfile !== 'classic' && userProfile !== 'private') {
            throw new Error('Accès refusé : profil conducteur requis');
        }

        try {
            const driversQuery = query(
                collection(this._db, 'drivers'),
                where('user_id', '==', driver.user_id),
            );
            const driversSnap = await getDocs(driversQuery);
           // const drivers: Driver[] = driversSnap.docs.map(doc => doc.data() as Driver);
            console.log(driversSnap , "driversSnap" , driver, " POPOPO @@@" , userProfile)

            // Récupérer la requête depuis Firestore
            // const requestSnap = await getDocs(
            //     query(collection(this._db, 'requests'), where('__name__', '==', requestRef.id ))
            // );
            const requestSnap = driversSnap;
            console.log(requestSnap , "requestSnap &&&&&&&&&&&&&&&&&&&&&&&&&&&&", requestRef , "  ", `request${requestRef.id}`)  ;
            const requestData = requestSnap.docs[0]?.data();

            if (!requestData) {
                throw new Error('Requête non trouvée');
            }

            // Afficher le popup avec les caractéristiques de la requête
            this.dialog.open(RequestPopupComponent, {
                data: driver,
                width: '400px',
            });
        } catch (error) {
            console.error('Erreur lors de la récupération de la requête :', error);
            throw error;
        }
    }
}
