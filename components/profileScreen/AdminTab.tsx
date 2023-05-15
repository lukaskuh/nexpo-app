import React from "react";
import Colors from "constants/Colors";
import { useState } from "react";
import { TextInput, View, StyleSheet, Modal, Pressable, ScrollView } from "react-native";
import { ArkadButton } from "components/Buttons";
import { ArkadText } from "components/StyledText";
import { Message, sendMessage } from "api/Messages";
import { COMMITTEES, ROLES } from "./DroppdownItems";
import { Committee } from "api/Committee";
import { Role } from "api/Role";
import { CategoriesDropdown } from "components/companies/CategoriesDroppdown";

export default function AdminTab() {
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");

  const [committees, setCommittees] = useState(COMMITTEES);
  const [committeeValue, setCommitteeValue] = useState<Committee[]>([]);
	const [committeeModal, setCommitteeModal] = useState(false);

  const [roles, setRoles] = useState(ROLES);
  const [roleValue, setRoleValue] = useState<Role[]>([]);
  const [roleModal, setRoleModal] = useState(false);

  const [userName, setUserName] = useState("");

	const send = () => {

    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes();

    const message: Message = {
      title: title,
      content: text,
      date: date,
      time: time,
      receiver: "TODO",
      sender: "TODO",
    }

    sendMessage(message);

    console.log("Sending message: " );
    console.log(text);
	};

	return (
		<ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}} contentContainerStyle={{alignItems: "center"}}>
      <ArkadText text="Send mass message" style={{fontSize: 40, color: "black", marginTop: 10}} />
      <View style={styles.centeredViewCommittee}>
        <View style={styles.modalView}>
          <CategoriesDropdown
            title="Select committee"
            items={committees}
            setOpen={setCommitteeModal}
            setValue={setCommitteeValue}
            open={committeeModal}
            value={committeeValue}
            setItems={setCommittees}
            categories={false}
            single={false}
          />
        </View>
      </View>
			<TextInput
        style={styles.titleInput}
				onChangeText={setTitle}
				value={title}
				placeholder={"Title..."}
				placeholderTextColor={Colors.lightGray}
				multiline={false}
        textAlign="center"
			/>
			<TextInput
				style={styles.textInput}
				onChangeText={setText}
				value={text}
				placeholder={"Message to send..."}
				placeholderTextColor={Colors.lightGray}
				multiline={true}
				textAlignVertical="top"
				numberOfLines={10}
			/>
      <ArkadButton onPress={send} style={styles.buttonContainer1}>
        <ArkadText text="Send" style={styles.buttonText} />
      </ArkadButton>

      <ArkadText text="Change user role" style={{fontSize: 40, color: "black", marginTop: 10}} />
      <TextInput
        style={styles.userNameInput}
        onChangeText={setUserName}
        value={userName}
        placeholder={"Username..."}
        placeholderTextColor={Colors.lightGray}
        multiline={false}
        textAlign="left"
      />
      {/* TODO: fix styling */}
      <View style={{flexDirection: "row", width: "100%"}}>
        <ArkadButton onPress={() => console.log("change button pressed")} style={styles.buttonContainer1}>
          <ArkadText text="Change" style={styles.buttonText} />
        </ArkadButton>
        <View style={styles.centeredViewRoles}>
          <View style={styles.modalView}>
            <CategoriesDropdown
              title="Change role to..."
              items={roles}
              setOpen={setRoleModal}
              setValue={setRoleValue}
              open={roleModal}
              value={roleValue}
              setItems={setRoles}
              categories={false}
              single={true}
            />
          </View>
        </View>
      </View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
  modalView: {
    marginBottom: 12,
    borderRadius: 20,
    padding: 0,
    alignItems: "center",
  },
	textInput: {
		height: "60",
		margin: 12,
		borderColor: Colors.arkadNavy,
		color: Colors.arkadNavy,
		borderRadius: 7,
		borderWidth: 2,
		fontSize: 20,
		fontFamily: "main-font-bold",
		padding: 10,
		width: "90%",
	},
  titleInput: {
    height: "20",
    borderColor: Colors.arkadNavy,
    color: Colors.arkadNavy,
    borderRadius: 7,
    borderWidth: 2,
    fontSize: 20,
    fontFamily: "main-font-bold",
    padding: 10,
    width: "90%",
  },
  userNameInput: {
    height: "20",
    marginTop: "10%",
    borderColor: Colors.arkadNavy,
    color: Colors.arkadNavy,
    borderRadius: 7,
    borderWidth: 2,
    fontSize: 20,
    fontFamily: "main-font-bold",
    padding: 10,
    width: "40%",
  },
	buttonText: {
		padding: "1%",
		alignItems: "center",
    fontSize: 18,
	},
	buttonContainer1: {
    alignSelf: "center",
    padding: "4%",
    marginBottom: "2%",
    width: "45%",
  },
	centeredViewCommittee: {
    justifyContent: "flex-start",
    borderWidth: 0,
    borderColor: Colors.lightGray,
    borderRadius: 15,
    padding: 0,
    margin: 0,
    width: "90%",
  },
	centeredViewRoles: {
    justifyContent: "flex-start",
    borderWidth: 0,
    borderColor: Colors.lightGray,
    borderRadius: 15,
    padding: 0,
    margin: 0,
    width: "40%",
  },
});
