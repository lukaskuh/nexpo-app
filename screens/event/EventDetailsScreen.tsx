import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Switch,
  Text,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import Colors from "constants/Colors";

import { API } from "api/API";
import { bookedEvent, Event } from "api/Events";
import {
  CreateTicketDto,
  getTicketForEvent,
  removeTicket,
  Ticket,
  UpdateTicketDto,
} from "api/Tickets";

import { View } from "components/Themed";
import ScreenActivityIndicator from "components/ScreenActivityIndicator";
import { ArkadButton } from "components/Buttons";
import { ArkadText, NoButton } from "components/StyledText";
import QRCode from "react-native-qrcode-svg";
import { format, set, subDays, parse } from "date-fns";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { CategoriesDropdown } from "components/companies/CategoriesDroppdown";
import { LUNCHTIMES } from "components/companies/DroppdownItems";

export default function EventDetailsScreen(id: number) {
  const [event, setEvent] = useState<Event | null>(null);
  const [registered, setRegistered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [wantTakeaway, setWantTakeaway] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [update, setUpdate] = useState(true);

  const [currentDate, setCurrentDate] = useState("");

  const [lunchtimes, setLunchtimes] = useState(LUNCHTIMES);
  const [takeawayOpen, takeawaySetOpen] = useState(false);
  const [value, setValue] = useState("");
  const [formattedSelectedTime, setFormattedSelectedTime] = useState("");

  const handleTimeChange = () => {
    const [hours, minutes, seconds] = value.split(":").map(Number);

    if (!event?.date) return;
    const date = new Date(event.date);

    // Extract the year, month, and day
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Create a new Date object with the extracted date
    const takeAwayTime = new Date(year, month, day);

    // Set the time components
    takeAwayTime.setHours(hours); // +2 for timezone (UTC)
    takeAwayTime.setMinutes(minutes);
    takeAwayTime.setSeconds(seconds);

    setSelectedTime(takeAwayTime);
    setFormattedSelectedTime(value);
  };

  const eventStopSellingDate = () => {
    if (!event?.start) return "N/A";
    const eventTime = new Date(event.date);
    const stopSellingDate = subDays(eventTime, 2);
    return (
      format(stopSellingDate, "d LLL") + " - " + event.start.substring(0, 5)
    );
  };
  
  const eventExpired = () => {
    if (!event?.start) return false;
    const eventTime = new Date(event.date);
    const stopSellingDate = subDays(eventTime, 2);
    const today = new Date();
    return today > stopSellingDate;
  }

  const getEvent = async () => {
    const event = await API.events.getEvent(id);
    setEvent(event);
    const reg = await bookedEvent(event);
    setRegistered(reg);
    if (reg) {
      const ticket = await getTicketForEvent(event);
      setTicket(ticket);
      if (ticket && ticket.takeAway) {
        setWantTakeaway(true);
      }
    }
  };

  const getDate = async () => {
    let month = new Date().getMonth();
    let day = new Date().getDate();
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    if (minutes < 10) {
      const new_minutes = "0" + String(minutes);
      setCurrentDate(day + "/" + month + " " + hours + ":" + new_minutes);
    } else {
      setCurrentDate(day + "/" + month + " " + hours + ":" + minutes);
    }
  };

  const createTicket = async () => {
    setLoading(true);

    if (event?.id == undefined) {
      return;
    }

    let ticketRequest: CreateTicketDto;
    let ticketUpdate: UpdateTicketDto;
    let temp_ticket: Ticket | null = null;
    if (wantTakeaway && (selectedTime !== null || selectedTime !== undefined)) {
      ticketUpdate = {
        takeAway: wantTakeaway,
        takeAwayTime: selectedTime,
      };
      temp_ticket = await API.tickets.updateTicket(
        ticket?.id ?? 0,
        ticketUpdate
      );
      const utc_time = new Date(temp_ticket?.takeAwayTime ?? "");
      utc_time.setHours(utc_time.getHours() + 2);
      const updatedTicket = {
        ...temp_ticket,
        takeAwayTime: utc_time,
      };
      setTicket(updatedTicket);
    } else {
      ticketRequest = {
        eventId: event.id,
        photoOk: true,
      };
      temp_ticket = await API.tickets.createTicket(ticketRequest);
      setTicket(temp_ticket);
    }

    if (update && wantTakeaway) {
      let eventTime = event?.date;
      const dateTime = eventTime.split(" ");
      alert(
        "Registered to " +
          event?.name +
          " " +
          dateTime[0] +
          "\nTakeaway at " +
          selectedTime
      );
    } else {
      alert("Registered to " + event?.name + " " + event?.date);
    }
    alert(
      "If you have any allergies or food preferences, please update your profile accordingly."
    );

    getEvent();

    setLoading(false);
  };

  async function deregister(): Promise<void> {
    setLoading(true);
    if (event?.id == undefined) {
      return;
    }

    const ticket: Ticket | null = await getTicketForEvent(event);
    if (ticket == null) {
      Toast.show({
        type: "error",
        text1: "You are not booked to the event: " + event?.name,
        visibilityTime: 5000,
      });
      return;
    }

    const success = await removeTicket(ticket.id);
    if (success) {
      alert("Successfully de-registered from: " + event?.name);
      getEvent();
    } else {
      alert("Could not de-register from :" + event?.name);
    }
    setLoading(false);
  }

  const updateTicket = () => {
    setUpdate(!update);
    createTicket();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getEvent();
      await getDate();
      setLoading(false);
    };

    fetchData();
  }, []);

  function getMonthName(monthNumber: number) {
    const date = new Date();
    date.setMonth(monthNumber);

    return date.toLocaleString("en-US", {
      month: "long",
    });
  }

  const validTime = () => {
    if (!event?.date || !event?.start || !event?.end) return false;
    if (currentDate === "") return false;

    const event_formated = API.events.formatTime(
      event?.date,
      event?.start,
      event?.end
    );
    const event_date = event_formated.slice(0, 6);
    const event_start = event_formated.slice(10, 15);
    const event_end = event_formated.slice(18, 23);

    const split = currentDate.split("/");
    const month = split[1].split(" ")[0];
    const date =
      String(getMonthName(Number(month))).slice(0, 3) + " " + split[0];
    const time = split[1].split(" ")[1];

    let upd_event_date;
    if (event_date[5] === " ") {
      upd_event_date = event_date.slice(0, event_date.length - 1);
    } else {
      upd_event_date = event_date;
    }
    let dateParts = upd_event_date.split(" ");
    dateParts[1] = String(Number(dateParts[1]) - 2);
    upd_event_date = dateParts.join(" ");

    const parseDate = (dateStr: string) => {
      return parse(dateStr, "MMM d HH:mm", new Date());
    };

    const date1 = parseDate(upd_event_date + " " + event_start);
    const date2 = parseDate(date + " " + time);

    const isSecondDateLater = date2 < date1;

    return isSecondDateLater;
  };

  if (loading || !event) {
    return <ScreenActivityIndicator />;
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <QrModal />
        <View style={styles.titleContainer}>
          <ArkadText text={event.name} style={styles.title} />
        </View>
        <View style={styles.headerContainer}>
          <View style={[styles.subHeaderContainer, { flex: 0.7 }]}>
            <View style={styles.leftItem}>
              <Ionicons name="calendar" size={16} color="white" />
              <ArkadText
                text={API.events.formatTime(event.date, event.start, event.end)}
                style={styles.headerText}
              />
            </View>
            <View style={styles.leftItem}>
              <Ionicons name="map" size={16} color="white" />
              <ArkadText text={event.location} style={styles.headerText} />
            </View>
            <View style={styles.leftItem}>
              <MaterialCommunityIcons
                name="microphone"
                size={16}
                color="white"
              />
              <ArkadText text={event.host} style={styles.headerText} />
            </View>
          </View>
          <View style={[styles.subHeaderContainer, { flex: 0.3 }]}>
            <View style={styles.rightItem}>
              <Ionicons name="people" size={16} color="white" />
              <ArkadText
                text={event.ticketCount + "/" + event.capacity}
                style={styles.headerText}
              />
            </View>
            <View style={styles.rightItem}>
              <MaterialIcons name="language" size={16} color="white" />
              <ArkadText text={event.language} style={styles.headerText} />
            </View>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <ArkadText text={event.description} style={styles.description} />
        </View>
        {ticket && registered && ticket?.event?.type === 1 && (
          <View style={styles.takeawayContainer}>
            <ArkadText text="Takeaway " style={styles.title} />
            <Switch
              value={wantTakeaway}
              onValueChange={(value) => setWantTakeaway(value)}
            />
          </View>
        )}
        {ticket?.takeAway && (
          <View style={styles.takeawayContainer}>
            <ArkadText
              text={
                "You have booked takeaway at: " +
                (ticket.takeAwayTime
                  ? (() => {
                      const timeParts = ticket.takeAwayTime
                        ?.toString()
                        .split("T")[1]
                        .split(":");
                      const hours = (parseInt(timeParts[0]) + 2)
                        .toString()
                        .padStart(2, "0");
                      const minutes = timeParts[1];
                      return hours + ":" + minutes;
                    })()
                  : "")
              }
              style={styles.title}
            />
          </View>
        )}
        {wantTakeaway && (
          <View style={styles.centeredViewPicker}>
            <CategoriesDropdown
              title="Select pick-up time"
              items={lunchtimes}
              setOpen={takeawaySetOpen}
              setValue={setValue}
              open={takeawayOpen}
              value={value}
              setItems={setLunchtimes}
              onChangeValue={handleTimeChange}
              categories={false}
              single={true}
            />
            {update && value ? (
              <ArkadButton
                onPress={updateTicket}
                style={styles.updateTicketButton}
              >
                <ArkadText text="Update ticket" />
              </ArkadButton>
            ) : value ? (
              <ArkadButton
                style={styles.updatedTicketButton}
                onPress={() => ""}
              >
                <ArkadText text="Ticket updated" />
              </ArkadButton>
            ) : (
              <ArkadText text="" />
            )}
          </View>
        )}

        {ticket && registered ? (
          <>
            {ticket.isConsumed ? (
              <NoButton text="Ticket consumed!" style={styles.consumedText} />
            ) : ticket?.event?.type !== 1 && ticket?.event?.type !== 2 ? (
              <View>
                <View style={styles.buttonContainer}>
                  <ArkadButton
                    onPress={() => deregister()}
                    style={styles.bookedButton}
                  >
                    <ArkadText
                      text="De-register from event"
                      style={styles.title}
                    />
                  </ArkadButton>
                </View>
                <ArkadText
                  text={`Last date to de-register to this event is: ${eventStopSellingDate()}`}
                  style={{ color: Colors.arkadNavy }}
                />
              </View>
            ) : null}

            <ArkadText text="Your ticket" style={styles.ticketTitle} />
            <Pressable
              style={[
                styles.qrContainer,
                {
                  backgroundColor: Colors.white,
                  borderColor: Colors.arkadTurkos,
                  borderWidth: 4,
                  borderRadius: 14,
                },
              ]}
              onPress={() => setModalVisible(true)}
            >
              <QRCode size={160} value={ticket.code} />
            </Pressable>
          </>
        ) : event.capacity === event.ticketCount ? (
          <NoButton
            text="No tickets Left. Drop-in available"
            style={styles.consumedText}
          />
        ) : event && !validTime() ? (
          <NoButton
            text="Last day to register have passed"
            style={styles.consumedText}
          />
        ) : !eventExpired && (
          <>
            <ArkadButton onPress={createTicket} style={styles.bookButton}>
              <ArkadText text="Register to event" style={styles.title} />
            </ArkadButton>
            <ArkadText
              text={`Last date to register to this event is: ${eventStopSellingDate()}`}
              style={{ color: Colors.white, paddingBottom: 20 }}
            />
          </>
        )}
      </View>
    </ScrollView>
  );

  function QrModal() {
    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        style={{ backgroundColor: "transparent" }}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View
            style={[
              styles.qrModalContainer,
              {
                backgroundColor: ticket?.isConsumed
                  ? Colors.darkRed
                  : Colors.white,
              },
            ]}
          >
            {event?.date && event?.start && event?.end && (
              <ArkadText
                text={API.events.formatTime(
                  event?.date,
                  event?.start,
                  event?.end
                )}
                style={
                  styles.ticketTitle && {
                    color: ticket?.isConsumed ? Colors.white : Colors.arkadNavy,
                    fontSize: 30,
                  }
                }
              />
            )}
            {ticket && (
              <QRCode
                size={Dimensions.get("window").width * 0.75}
                value={ticket.code}
              />
            )}
          </View>
          <ArkadButton onPress={() => setModalVisible(!modalVisible)}>
            <ArkadText text={"Close"} />
          </ArkadButton>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  ticketTitle: {
    color: Colors.white,
    fontSize: 26,
    marginBottom: 10,
    paddingTop: "2%",
  },
  scrollView: {
    backgroundColor: Colors.arkadNavy,
  },
  consumedText: {
    alignSelf: "center",
    backgroundColor: Colors.darkRed,
    borderRadius: 14,
    borderWidth: 4,
    borderColor: Colors.darkRed,
    marginTop: 40,
    marginBottom: 20,
    fontSize: 20,
    padding: 22,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    width: "90%",
  },
  container: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: Colors.arkadNavy,
    borderColor: Colors.white,
    borderWidth: 4,
    borderRadius: 14,
  },
  titleContainer: {
    width: "90%",
    marginTop: 20,
    height: 100,
    backgroundColor: Colors.arkadTurkos,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: "center",
    borderColor: Colors.arkadTurkos,
    borderWidth: 4,
    borderRadius: 14,
  },
  title: {
    justifyContent: "center",
    fontSize: 24,
    color: Colors.white,
  },
  headerContainer: {
    width: "90%",
    marginTop: 24,
    flexDirection: "row",
    alignContent: "center",
    backgroundColor: Colors.arkadNavy,
  },
  subHeaderContainer: {
    flex: 1,
    flexDirection: "column",
    alignContent: "space-around",
  },
  leftItem: {
    marginTop: 16,
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
  },
  rightItem: {
    marginTop: 16,
    flexDirection: "row-reverse",
    alignSelf: "flex-end",
    alignItems: "center",
  },
  headerText: {
    color: Colors.white,
    fontSize: 16,
    paddingHorizontal: 8,
    textAlign: "left",
  },
  descriptionContainer: {
    marginTop: 40,
    width: "90%",
  },
  description: {
    fontSize: 18,
    textAlign: "left",
    color: Colors.white,
  },
  bookButton: {
    width: "90%",
    marginTop: 40,
    marginBottom: 20,
    backgroundColor: Colors.lightGreen,
  },
  bookedButton: {
    backgroundColor: Colors.darkRed,
    marginTop: 40,
    width: "90%",
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: "center", // Center the button horizontally
  },
  qrHeader: {
    marginTop: 24,
    fontSize: 30,
    color: Colors.white,
    marginBottom: 8,
  },
  qrContainer: {
    borderWidth: 3,
    borderColor: Colors.arkadTurkos,
    borderRadius: 5,
    padding: 16,
    marginBottom: 60,
  },
  qrModalContainer: {
    borderRadius: 5,
    padding: 16,
    backgroundColor: Colors.arkadNavy,
  },
  modalOverlay: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  takeawayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.arkadOrange,
    borderRadius: 10,
    maxWidth: "90%",
  },

  timePickerLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    padding: 3,
    marginTop: 30,
  },
  picker: {
    width: "85%",
    maxWidth: 400,
    padding: 10,
    borderRadius: 4,
    borderColor: Colors.white,
    margin: 12,
    backgroundColor: Colors.arkadNavy,
    color: Colors.white,
  },
  updateTicketButton: {
    display: "flex", // You need to use display: flex to enable flexbox layout
    justifyContent: "center",
    backgroundColor: Colors.arkadOrange,
    marginBottom: 20,
    color: Colors.white,
  },
  updatedTicketButton: {
    display: "flex", // You need to use display: flex to enable flexbox layout
    justifyContent: "center",
    backgroundColor: Colors.arkadGreen,
    marginBottom: 20,
    color: Colors.white,
  },
  centeredViewPicker: {
    justifyContent: "flex-start",
    borderWidth: 0,
    borderColor: Colors.lightGray,
    borderRadius: 15,
    padding: 0,
    margin: 0,
    marginBottom: 12,
    width: "60%",
  },
});
