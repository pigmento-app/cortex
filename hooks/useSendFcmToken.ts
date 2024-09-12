import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { API_BASE_URL, firebaseConfig } from '@/config';

export function useSendFcmToken() {
	const sendFcmToken = async () => {
		try {
			if (!firebase.apps.length) {
				firebase.initializeApp(firebaseConfig);
			}

			await messaging().registerDeviceForRemoteMessages();
			const token = await messaging().getToken();

			const response = await fetch(`${API_BASE_URL}/notifications/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token }),
			});

			const result = await response.json();
			if (result.error) {
				throw new Error(result.error);
			}
		} catch (err) {
			console.error(err);

			return;
		}
	};

	useEffect(() => {
		sendFcmToken();
	}, []);
}
