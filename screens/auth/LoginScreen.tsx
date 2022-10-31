import React, { useEffect, useState } from 'react';
import { Image, ActivityIndicator, StyleSheet, Pressable, ScrollView } from 'react-native';

import { View } from '../../components/Themed';
import { TextInput } from '../../components/TextInput';

import { ArkadButton } from '../../components/Buttons';
import { ArkadText } from '../../components/StyledText';

import { API } from '../../api'
import { AuthContext } from '../../components/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from "./AuthNavigator";
import Colors from '../../constants/Colors';


type LoginScreenParams = {
  navigation: StackNavigationProp<
    AuthStackParamList,
    'LoginScreen'
  >;
};

export default function LoginScreen({ navigation }: LoginScreenParams) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [writing, setWriting] = useState<boolean>(false);
  const authContext = React.useContext(AuthContext);

  const login = async () => {
    // We get errors when unmounting for some reason, this might be a solution: 
    // https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
    // but I am not too sure of the call stack in this async call, it should be fine as the unmount is the last call
    // It is probably because the state updates don't happen immediately.
    setLoading(true);
    
    const success = await API.auth.login(email.toLowerCase(), password);

    setLoading(false);
    if (success.status === 400) {
      alert('wrong email or password');
    }
    else if (!success.ok) {
      alert('Login not successful');
    }
    else {
      authContext.signIn();
    }
  }

  return (
    <ScrollView keyboardShouldPersistTaps = "handled" style={styles.container}>
      <Image 
        style={styles.logo} 
        source={require('../../assets/images/arkad_logo.png')} 
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email" 
          keyboardType="email-address"
          onChangeText={setEmail}
          onSubmitEditing={login}
          />
        <TextInput
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          onSubmitEditing={login} />
        { loading
          ? <ActivityIndicator/>
          : <ArkadButton onPress={login} style={styles.loginButton}>
              <ArkadText text='Sign In' style={{}}/>
          </ArkadButton>
        }
        <Pressable style={styles.signUpContainer} onPress={() => navigation.navigate('SignUpScreen') }>
          <ArkadText style={styles.signUpText}text={"Don't have an account? Sign up here!"}/>
        </Pressable>
        <Pressable style={styles.signUpContainer} onPress={() => navigation.navigate('ForgotPasswordScreen') }>
          <ArkadText style={styles.signUpText} text={"Forgot your password?"}/>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    zIndex: 2,
  },
  inputContainer: {
    width: '80%',
    maxWidth: 400,
    zIndex: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  signUpContainer: {
    marginTop: 20,
    padding: 16,
  },
  signUpText: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: Colors.darkBlue,
  },
  loginButton: {
    width: '45%',
    alignSelf: 'center',
    zIndex: 2,
  },
  clickOffContainer: {
    maxWidth: 400,
    maxHeight: 400,
    resizeMode: 'contain',
    backgroundColor: 'transparent',
    zIndex: 3,
  }
});
