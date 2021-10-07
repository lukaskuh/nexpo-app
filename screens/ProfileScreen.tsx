import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

import { API } from '../api'
import { UserInformation } from '../api/users';
import { ListedEvent } from '../api/events';

import ScreenActivityIndicator from '../components/ScreenActivityIndicator';
import { ArkadButton } from '../components/Buttons';
import { ArkadText } from '../components/StyledText';
import { AuthContext } from '../components/AuthContext';

import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileParamList } from '../types';
import { BookedEventList } from '../components/profileScreen/BookedEventList';
import { EmptyEventItem } from '../components/profileScreen/EmptyEventItem';

const { width, height } = Dimensions.get('window')

type profileNavigation = {
  navigation: StackNavigationProp<
    ProfileParamList,
    'ProfileScreen'
  >
};

export default function ProfileScreen({navigation}: profileNavigation) {
  const [userInformation, setUserInformation] = useState<UserInformation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [bookedEvents, setBookedEvents] = useState<ListedEvent[] | null>(null);
  const authContext = useContext(AuthContext);

  const getUserInformation = async () => {
    const userInformation = await API.users.getMe();
    setUserInformation(userInformation);
  }

  const getRegisteredEvents = async () => {
    const bookedEvents = await API.events.getBookedEvents();
    setBookedEvents(bookedEvents);
  }

  const logout = async () => {
    await API.auth.logout();
    authContext.signOut();
  };

  useEffect(() => {
    setLoading(true);
    getUserInformation();
    getRegisteredEvents();
    setLoading(false);
  }, []);

  if (loading || userInformation == undefined) {
    return (
      <View style={{flex: 1}}>
        <ScreenActivityIndicator />
        <ArkadButton onPress={logout} style={styles.logout}>
          <ArkadText text='Logout' style={{}}/>
        </ArkadButton> 
      </View>
    );
  }
  else {
    return (
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <ArkadText 
            text={userInformation.first_name + " " + userInformation.last_name} 
            style={styles.name} />

          <View style={styles.infoItem}>
            <Ionicons name="mail" size={16} color="black"/>
            <ArkadText text={userInformation.email} style={styles.itemText} />
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="call" size={16} color="black"/>
            <ArkadText text={userInformation.phone_number} style={styles.itemText} />
          </View>

          <ArkadText text={"Booked events"} style={styles.header} />

          {bookedEvents == undefined 
          ? <Text>Loading events...</Text>
          : bookedEvents.length == 0 
            ? <EmptyEventItem />
            : <BookedEventList
                bookedEvents={bookedEvents}
                navigation={navigation} />
          }
        </View>

        <View style={styles.footer}>
          <ArkadButton onPress={logout} style={styles.logout}>
            <ArkadText text='Logout' style={{}} />
          </ArkadButton> 
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topHeader: {
    flex: 1,
  },
  name: {
    paddingTop: '10%',
    paddingBottom: '3%',
    justifyContent: 'center',
    fontSize: 24,
    color: Colors.darkBlue,
  },
  infoItem: {
    paddingTop: '4%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    color: Colors.darkBlue,
    fontSize: 12,
    paddingHorizontal: 8,
    textAlign: 'center'
  },
  header: {
    paddingTop: '26%',
    paddingLeft: 8,
    fontSize: 16,
    color: Colors.darkBlue,
    textAlign: 'left',
  },
  footer: {
    flex: 0,
    paddingBottom: '6%'
  },
  logout: {
    paddingTop: 20,
    width: width * 0.8,
  },
});
