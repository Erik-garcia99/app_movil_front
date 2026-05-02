import { useState, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useFirebaseNotifications() {
    const [initialRoute, setInitialRoute] = useState(null);
    const [notificationData, setNotificationData] = useState(null);

    useEffect(() => {
        requestUserPermission();
        getToken();

        // Manejar notificación cuando la app está en foreground
        const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
            console.log('📬 Notificación en foreground:', remoteMessage);
            handleNotificationInForeground(remoteMessage);
        });

        // Manejar cuando el usuario hace click en la notificación
        const unsubscribeNotificationOpenedApp = messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log('👆 Notificación abierta desde background/killed:', remoteMessage);
            if (remoteMessage?.data?.action === 'status_changed') {
                setInitialRoute('StatusUpdated');
                setNotificationData(remoteMessage.data);
            }
        });

        // Verificar si la app fue abierta desde una notificación
        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                if (remoteMessage?.data?.action === 'status_changed') {
                    setInitialRoute('StatusUpdated');
                    setNotificationData(remoteMessage.data);
                }
            });

        return () => {
            unsubscribeForeground();
            unsubscribeNotificationOpenedApp();
        };
    }, []);

    const requestUserPermission = async () => {
        try {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('✅ Permiso de notificaciones concedido');
            }
        } catch (error) {
            console.error('❌ Error solicitando permiso:', error);
        }
    };

    const getToken = async () => {
        try {
            const token = await messaging().getToken();
            console.log('🔑 FCM Token:', token);
            // Guardar en AsyncStorage para usarlo en login/register
            await AsyncStorage.setItem('fcm_token', token);
            return token;
        } catch (error) {
            console.error('❌ Error obteniendo token:', error);
        }
    };

    const handleNotificationInForeground = (remoteMessage) => {
        const { title, body } = remoteMessage.notification || {};
        const { action, status } = remoteMessage.data || {};

        if (action === 'status_changed') {
            setNotificationData(remoteMessage.data);
            // Aquí puedes mostrar un alert o un toast
            console.log(`Estado cambiado a: ${status}`);
        }
    };

    return {
        initialRoute,
        notificationData,
        getToken,
    };
}
