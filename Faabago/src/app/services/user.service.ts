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


interface Driver
{
    driver_id: string;
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

interface Taxi {
    number_client_sits: number;

    [key: string]: any;
}

interface DriverResult {
    driver: Driver;
    taxi: Taxi;
    distanceToClient: number;
    rideDistance: number;
    estimatedPrice: number;
}


@Injectable({ providedIn: 'root' })
export class UserService {
    userId: string = '';
}
