import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "./firebase";

// Types
export interface FirestoreUser {
    id: string;
    email: string;
    full_name: string;
    phone_number: string | null;
    role: "seeker" | "owner" | "admin";
    created_at: Timestamp;
}

export interface FirestoreBoardingHouse {
    id: string;
    owner_id: string;
    name: string;
    description: string | null;
    price_per_month: number;
    latitude: number;
    longitude: number;
    address: string;
    whatsapp_number: string;
    status: "pending" | "approved" | "rejected";
    created_at: Timestamp;
}

export interface FirestoreHouseImage {
    id: string;
    house_id: string;
    image_url: string;
    created_at: Timestamp;
}

// ==================== USERS ====================

export const createUser = async (
    uid: string,
    data: Omit<FirestoreUser, "id" | "created_at">,
) => {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
        ...data,
        created_at: Timestamp.now(),
    });
};

export const getUser = async (uid: string): Promise<FirestoreUser | null> => {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as FirestoreUser;
};

export const updateUser = async (uid: string, data: Partial<FirestoreUser>) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
};

// ==================== BOARDING HOUSES ====================

export const createBoardingHouse = async (
    data: Omit<FirestoreBoardingHouse, "id" | "created_at">,
): Promise<string> => {
    const housesRef = collection(db, "boarding_houses");
    const newDocRef = doc(housesRef);
    await setDoc(newDocRef, {
        ...data,
        created_at: Timestamp.now(),
    });
    return newDocRef.id;
};

export const getBoardingHouse = async (
    id: string,
): Promise<FirestoreBoardingHouse | null> => {
    const houseRef = doc(db, "boarding_houses", id);
    const snapshot = await getDoc(houseRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() } as FirestoreBoardingHouse;
};

export const getBoardingHousesByStatus = async (
    status: "pending" | "approved" | "rejected",
): Promise<FirestoreBoardingHouse[]> => {
    const housesRef = collection(db, "boarding_houses");
    const q = query(
        housesRef,
        where("status", "==", status),
        orderBy("created_at", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as FirestoreBoardingHouse,
    );
};

export const getBoardingHousesByOwner = async (
    ownerId: string,
): Promise<FirestoreBoardingHouse[]> => {
    const housesRef = collection(db, "boarding_houses");
    const q = query(
        housesRef,
        where("owner_id", "==", ownerId),
        orderBy("created_at", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as FirestoreBoardingHouse,
    );
};

export const getAllBoardingHouses = async (): Promise<
    FirestoreBoardingHouse[]
> => {
    const housesRef = collection(db, "boarding_houses");
    const q = query(housesRef, orderBy("created_at", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as FirestoreBoardingHouse,
    );
};

export const updateBoardingHouse = async (
    id: string,
    data: Partial<FirestoreBoardingHouse>,
) => {
    const houseRef = doc(db, "boarding_houses", id);
    await updateDoc(houseRef, data);
};

export const deleteBoardingHouse = async (id: string) => {
    const houseRef = doc(db, "boarding_houses", id);
    await deleteDoc(houseRef);
};

// ==================== HOUSE IMAGES ====================

export const createHouseImage = async (
    data: Omit<FirestoreHouseImage, "id" | "created_at">,
): Promise<string> => {
    const imagesRef = collection(db, "house_images");
    const newDocRef = doc(imagesRef);
    await setDoc(newDocRef, {
        ...data,
        created_at: Timestamp.now(),
    });
    return newDocRef.id;
};

export const getHouseImages = async (
    houseId: string,
): Promise<FirestoreHouseImage[]> => {
    const imagesRef = collection(db, "house_images");
    const q = query(imagesRef, where("house_id", "==", houseId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as FirestoreHouseImage,
    );
};

export const deleteHouseImage = async (id: string) => {
    const imageRef = doc(db, "house_images", id);
    await deleteDoc(imageRef);
};
