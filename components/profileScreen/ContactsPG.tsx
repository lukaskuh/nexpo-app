import React, { useEffect } from "react";
import { View, Text } from "../Themed";
import Colors from "constants/Colors";
import { ScrollView, StyleSheet } from "react-native";
import { ArkadText } from "components/StyledText";
import { API } from "api/API";
import { Contact } from "api/Contacts";

export default function Contacts() {
  const [contacts, setContacts] = React.useState<Contact[]>();

  useEffect(() => {
    fetch_contacts();
  }, []);

  async function fetch_contacts() {
    const contacts = await API.contacts.contacts();
    setContacts(contacts);
  }

  return (
    <ScrollView style={styles.container}>
      <ArkadText text={"Contacts"} style={styles.header} />
      {contacts?.reverse().map((contact) => (
        <View key={contact.id} style={styles.contactContainer}>
          <View style={styles.textContainer}>
            <View style={styles.textColumnContainer}>
              <ArkadText text={contact.roleInArkad} style={styles.role} />
              <ArkadText
                text={contact.firstName + " " + contact.lastName}
                style={styles.text}
              />
              <ArkadText text={contact.email} style={styles.text} />
              <ArkadText text={contact.phoneNumber} style={styles.text} />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    backgroundColor: Colors.arkadNavy,
  },
  header: {
    width: "100%",
    textAlign: "center",
    fontSize: 30,
    color: Colors.white,
  },
  role: {
    fontWeight: "bold",
    color: Colors.arkadOrange,
    fontSize: 24,
    paddingTop: 12,
  },
  text: {
    color: Colors.white,
    fontSize: 18,
  },
  contactContainer: {
    flex: 1,
    alignItems: "center",
  },
  textContainer: {
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textColumnContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
});
