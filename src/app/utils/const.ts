export const COLLECTION = {
    USERS: 'users',
    SWIPES: 'swipes',
    IMAGES: 'images',
    CHATS: 'chats',
    PREFERENCES: 'preferences'
}

export const SERVICE = {
    CONNECTION: 'connection',
    CAMERA: 'camera',
    LOCATION: 'location'
}
export const AUTH_TYPE = {
    google: 'google',
    email: 'email',
    phone: 'phone',
    apple: 'apple',
}

export const SWIPE_USER = {
    SWIPPER_UID: 'swipperUid',
    SWIPPED_UID: 'swippedUid',
    LIKE: 'like',
    MATCH: 'match'
}

export const MODALS = {
    MATCH: 'match',
    FILTER: 'filter',
    LOCATION: 'location',
    CAMERA: 'camera',
    
}
export const FIREBASE_ERROR = {

    EMAIL_ALREADY_REGISTERED: "The email address is already in use",
    PASSWORD_TOO_SHORT: "Password should be at least 6 characters",
    GENERIC_SIGNINP: "An error has occured while creating an account, please try again",
    VERIFICATION: "An error has occured while sending a veification email, please try again",
    GENERIC_STORE_DATA: "An error has occured while storing data, please try again.",
    SIGNIN_USER_NOT_FOUND: {key: "auth/user-not-found", value: "User not found, please check if your email address is correct or create account"},
    SIGNIN_INCORRECT_PASSWORD: {key: 'auth/wrong-password', value: "Invalid username or password"},
    SINGIN_GENERIC: "Something went wrong, please try again",
    SIGNI_BLOCKED: {
        key: "Access to this account has been temporarily disabled due to many failed login attempts",
        value: "Access to this account has been temporarily disabled due to many failed login attempts, You can immediately restore it by resetting your password or you can try again later"
    }
    
}

export const STATUS = {
    SUCCESS: 'success',
    FAILED: 'failed'
}
export const ROUTES = {
    AUTH: "auth",
    SIGNUP: "signup",
    USERS: "tabs/users",
    CHATS: "tabs/chats",
    CHAT: "/chat",
    PROFILE: "tabs/profile",
    TERMS: "tabs/terms",
    PREFERENCES: "preferences",
    INTRO: "intro",
}


export const STORAGE = {
    USER: 'user',
    USERS: 'users',
    SEEN_INTRO: 'seen-intro',
    LOCATION: 'location',
    SWIPES: 'swipes',
    PREFERENCES: 'preferences'
}
 