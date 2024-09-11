import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';

export function useSendFcmToken() {
	const sendFcmToken = async () => {
		try {
			await messaging().registerDeviceForRemoteMessages();
			const token = await messaging().getToken();

			await axios.post(
				`${process.env.REACT_APP_API_URL}/api/notifications/register`,
				{ token }
			);
		} catch (err) {
			if (axios.isAxiosError(err) && err.response) {
				console.error(err.response.data);
			} else {
				console.error(err);
			}
			return;
		}
	};

	useEffect(() => {
		sendFcmToken();
	}, []);
}
