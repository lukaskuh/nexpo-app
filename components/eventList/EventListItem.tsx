import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ListedEvent } from '../../api/events';
import { ArkadText } from '../StyledText';
import Colors from '../../constants/Colors';
import { API } from '../../api';

type ListedEventItemProps = {
  event: ListedEvent;
  booked: boolean;
  onPress: () => void;
}

export const EventListItem = ({ event, booked, onPress }: ListedEventItemProps) => 
  <Pressable onPress={onPress} style={styles.container}>
    <ArkadText style={styles.eventName} text={event.name}/>
    <ArkadText 
      style={styles.eventTime}
      text={API.events.formatTime(event.date, event.start, event.end)}
    />

    {/* Color of box changes depending on status */}
    {booked 
    ? <View 
        style={[
          styles.eventBookedContainer, 
          {backgroundColor: Colors.lightGreen}
          ]
        }>
        <ArkadText 
          style={styles.eventBookedText}
          text="Booked" />
      </View>
    : <View style={[
        styles.eventBookedContainer, 
        event.capacity == event.tickets 
          ? {backgroundColor:Colors.darkRed}
          : {backgroundColor:Colors.darkYellow}
        ]}
      >
        <ArkadText 
          style={styles.eventBookedText}
          text={event.tickets + "/" + event.capacity} />
      </View>
    }
  </Pressable>

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: Colors.darkBlue,
    padding: 16,
    borderRadius: 16,
  },
  eventName: {
    height: 50,
    fontSize: 16,
    textAlign: 'left',
    color: Colors.white,
  },
  eventTime: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'right',
    color: Colors.white,
  },
  eventBookedContainer: {
    marginTop: 4,
    alignSelf: 'flex-end',
    borderRadius: 10,
  },
  eventBookedText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: 16,
    color: Colors.white,
  },
})
