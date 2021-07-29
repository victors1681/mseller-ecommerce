import messaging from '@react-native-firebase/messaging';
import {NavigationContainerRef} from '@react-navigation/core';
import {ScreenLinks} from 'app/navigation/ScreenLinks';
import {Alert} from 'react-native';
import Config from 'react-native-config';

export class FRMessaging {
  navigationRef?: React.RefObject<NavigationContainerRef>;
  constructor(navigationRef: React.RefObject<NavigationContainerRef>) {
    this.navigationRef = navigationRef;
  }
  requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      //if(Platform.OS === 'ios') { )

      // Get the token
      //await messaging().registerDeviceForRemoteMessages();

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

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      Alert.alert(
        'A new FCM message arrived! background',
        JSON.stringify(remoteMessage),
      );
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      this.navigationRef?.current?.navigate(ScreenLinks.ORDERS);
      //navigation.navigate(remoteMessage.data.type);
    });

    return unsubscribe;
  };
}

export default FRMessaging;
