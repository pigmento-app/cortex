import { API_BASE_URL } from '@/config';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

export function useSendExpoPushToken() {
	useEffect(() => {
		const getPushToken = async () => {
			// Request permission for notifications
			const { status } = await Notifications.getPermissionsAsync();
			if (status !== 'granted') {
				await Notifications.requestPermissionsAsync();
			}

			// Get the push token
			const token = (
				await Notifications.getExpoPushTokenAsync({
					projectId: '691716c4-db22-476c-92e2-d79fa38955f3',
				})
			).data;

			try {
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

		getPushToken();
	}, []);
}
