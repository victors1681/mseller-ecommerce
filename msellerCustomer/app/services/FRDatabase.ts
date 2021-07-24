import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
class FRDatabase {
  tokenRef?: FirebaseDatabaseTypes.Reference;

  constructor() {
    this.tokenRef = database().ref('/tokens');
  }

  saveToken = async (clientId: string, options = {}) => {
    const token = await messaging().getToken();
    if (token) {
      await this.tokenRef?.child(clientId).set({
        token: token,
        ...options,
      });
    }
  };
}

export default FRDatabase;
