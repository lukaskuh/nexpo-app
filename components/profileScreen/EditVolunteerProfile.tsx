import React, { useState } from "react";
import { UpdateStudentDto, Student, Programme } from "api/Students";
import { View, Text } from "../Themed";
import { StyleSheet } from "react-native";
import { TextInput } from "../TextInput";
import { EditStatus } from "../../screens/profile/EditProfileScreen";
import { Picker } from "@react-native-picker/picker";
import Colors from "constants/Colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CategoriesDropdown } from "../companies/CategoriesDroppdown";
import { PROGRAMS } from "../companies/DroppdownItems";

type EditVolunteerProfileProps = {
  volunteer: Student;
  setUpdateVolunteerDto: (dto: UpdateStudentDto) => void;
  setEditStatus: (status: EditStatus) => void;
};

export default function EditVolunteerProfile({
  volunteer,
  setUpdateVolunteerDto,
  setEditStatus,
}: EditVolunteerProfileProps) {
  const [year, setYear] = React.useState<number | null>(volunteer.year);
  const [masterTitle, setMasterTitle] = React.useState<string | null>(
    volunteer.masterTitle
  );
  const [linkedIn, setLinkedIn] = React.useState<string>(
    volunteer.linkedIn === null ? "" : volunteer.linkedIn
  );
  const [programmes, setProgrammes] = useState(PROGRAMS);
  const [programmeOpen, programmeSetOpen] = useState(false);
  const [programme, setProgramme] = useState<Programme | null>(
    volunteer.programme
  );

  React.useEffect(() => {
    const dto = {
      programme,
      year,
      masterTitle,
      linkedIn,
    };
    setUpdateVolunteerDto(dto);
  }, [programme, linkedIn, masterTitle, year]);

  const _setLinkedIn = (text: string) => {
    setLinkedIn(text);
    if (text.length > 0 && !text.startsWith("https://www.linkedin.com/in/")) {
      setEditStatus({
        ok: false,
        message: "LinkedIn Needs to start with: https://www.linkedin.com/in/",
      });
    } else {
      setEditStatus({ ok: true, message: null });
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text
          style={{
            color: Colors.white,
            fontFamily: "main-font",
            fontSize: 20,
            paddingTop: 5,
          }}
        >
          Programme
        </Text>
        <View style={styles.programmepicker}>
          <CategoriesDropdown
            title="Desired program"
            items={programmes}
            setOpen={programmeSetOpen}
            setValue={setProgramme}
            open={programmeOpen}
            value={programme}
            setItems={setProgrammes}
            categories={false}
            single={true}
          />
        </View>

        <Text
          style={{
            color: Colors.white,
            fontFamily: "main-font",
            fontSize: 20,
            paddingTop: 5,
          }}
        >
          Year
        </Text>
        <Picker
          style={styles.picker}
          selectedValue={year}
          onValueChange={(value, index) => {
            if (index === 0) setYear(null);
            else setYear(Number(value));
          }}
        >
          <Picker.Item label="Select a year" />
          <Picker.Item label="1" value={1} />
          <Picker.Item label="2" value={2} />
          <Picker.Item label="3" value={3} />
          <Picker.Item label="4" value={4} />
          <Picker.Item label="5" value={5} />
        </Picker>

        <Text
          style={{
            color: Colors.white,
            fontFamily: "main-font",
            fontSize: 20,
            paddingTop: 5,
          }}
        >
          Master Title
        </Text>
        <TextInput
          style={styles.textInput}
          value={masterTitle ? masterTitle : ""}
          onChangeText={setMasterTitle}
        />

        <Text
          style={{
            color: Colors.white,
            fontFamily: "main-font",
            fontSize: 20,
            paddingTop: 5,
          }}
        >
          LinkedIn
        </Text>
        <TextInput
          style={styles.textInput}
          value={linkedIn ? linkedIn : ""}
          onChangeText={_setLinkedIn}
          placeholder="https://www.linkedin.com/in/..."
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    backgroundColor: Colors.arkadNavy,
  },
  picker: {
    width: "80%",
    maxWidth: 400,
    padding: 10,
    borderRadius: 7,
    borderWidth: 5,
    borderColor: Colors.white,
    margin: 12,
    backgroundColor: Colors.arkadNavy,
    color: Colors.white,
  },
  programmepicker: {
    width: "80%",
    maxWidth: 433,
    padding: 10,
    borderColor: Colors.white,
    margin: 12,
    backgroundColor: Colors.arkadNavy,
    color: Colors.white,
    fontFamily: "main-font-bold",
    borderRadius: 7,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 18,
  },
  textInput: {
    width: "80%",
    maxWidth: 400,
    borderColor: Colors.white,
    color: Colors.white,
  },
});
