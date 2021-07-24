import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import Config from 'react-native-config';

export class FRMessaging {
  requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      //if(Platform.OS === 'ios') { )

      // Get the token
      //await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log('Device Token', token);

      console.log('Authorization status:', authStatus);

      await messaging().subscribeToTopic(Config.APP_NAME || 'gobal');
      console.log(`Subscribed to topic ${Config.APP_NAME}`);
    }
  };

  //Foreground state messages

  subscribeMessage = () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  };
}

export default FRMessaging;
