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

export interface Location{
    administrativeArea: string;
    areasOfInterest: string;
    countryCode: string;
    countryName: string;
    latitude: number;
    longitude: number;
    locality: string;
    postalCode: string;
    subAdministrativeArea: string; 
    subLocality: string;
    subThoroughfare: string;
    thoroughfare: string;
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
    loginType: string;
    lastMsg?: Message;
    location: {
        distance: string;
        geo: Geo,
        address?: string
    }
 }
 
 export interface Geo {
    latitude: number;
    longitude: number
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

export interface Filter {
    category: string;
    distance: number;
}

export interface Preferences {
    distance: string;
}