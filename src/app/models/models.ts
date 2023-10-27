export interface Country {
    dialCode: string,
    flag: string,
    name: string
    code: string;
}

export interface Flags {
    flags: string,
    country: string;
    code: string;
}

export interface LatLng{
    lat: number,
    lng: number
}
export interface User {
    uid: string;
    name: string;
    email: string;
    password?: string;
    gender: string;
    want: string[],
    with: string[];
    dob: string;
    phone?: string;
    images: string[];
    profile_picture: string;
    isVerified: boolean;
    dateCreated?: string;
    compensation?: string;
    verificationCode?: string;
    lastMsg?: Message;
    location: {
        distance: string;
        geo: Geo
    }
 }

 export interface Geo {
   lat: number,
   lng: number;
 }

 export interface Message {
    msg: string,
    createdAt: any,
    from: string;
    to: string;
 }

 export interface MessageBase {
   messages: Message[],
   uid?: string;
 }

 export interface Swipe {
   swipperUid?: string;
   swippedUid: string;
   like: boolean;
   uid?: string;
   match: boolean;
 }
 

export interface MessageObj {
    messages: Message[];
}

 export interface Chat {
    senderUid: string;
    recieverUid: string;
    message: string;
    timestamp: any;
    uid?: string;
}

 export interface Location {
    lat: number;
    lng: number;
}

export interface Filter {
    category: string;
    distance: number;
}

export interface Preferences {
    distance: string;
}