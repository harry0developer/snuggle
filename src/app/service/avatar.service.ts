import { Injectable } from '@angular/core';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';

@Injectable({
	providedIn: 'root'
})
export class AvatarService {
	constructor(private firestore: Firestore, private storage: Storage) {}

	getUserProfile(user) {
		const userDocRef = doc(this.firestore, `users/${user.uid}`);
		return docData(userDocRef, { idField: 'id' });
	}

	async uploadImage(user,cameraFile: Photo) {
		const path = `uploads/${user.uid}/profile.webp`;
		const storageRef = ref(this.storage, path);

		try {
			await uploadString(storageRef, cameraFile.base64String, 'base64');

			const imageUrl = await getDownloadURL(storageRef);

			const userDocRef = doc(this.firestore, `users/${user.uid}`);
			await setDoc(userDocRef, {
				imageUrl
			});
			return true;
		} catch (e) {
			return null;
		}
	}
}