import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Button, Text, View, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';
import { WebView } from 'react-native-webview';
import {useEffect, useState} from 'react';
import afc_logo from './assets/afc_logo.png';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY';

async function getCoordinatesFromAddress(address) {
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`);
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    const location = data.results[0].geometry.location;
    return { latitude: location.lat, longitude: location.lng };
  }
  return null; // handle error or no results scenario
}


function HomeScreen({navigation}) {
const [updates, setUpdates] = useState([])
const [loading, setLoading] = useState(true);


useEffect(() => {
  fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(json => {
        setUpdates(json);
        setLoading(false);
        console.log(json);
      })
        .catch((error) => {
          console.error("There was an error fetching the data", error);
          setLoading(false);
        });
    }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  
  return (
    <ScrollView >
      {updates.map((item, index) => (
        <TouchableOpacity 
        key={index}
        onPress={() => navigation.navigate('Update', {item})}
        >
        <Text style={styles.newsTitle}>{item.title}</Text>
        </TouchableOpacity>
        ))}
    </ScrollView>
  );
}


function UpdateScreen({route}){

  if (!route.params) {
    
    return <Text style={styles.newsError}>Error loading data, please select an article from the homepage</Text> 
  }
  const {item} = route.params;

  return(
    
    <View style={styles.newsContainer}>
      
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsBody}>{item.body}</Text> 
      <Text>{item.date}</Text>
    </View>
  );
}


function ContactScreen({navigation}) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View>
              {
        location ? (
          <MapView 
            style={{  width: '100%', height: '70%'}} // Estyle={{ width: '100%', height: '100%' }} nsure the map fills the space
            region={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          >
            <Marker 
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
              }}
              title="Your Location"
            />
          </MapView>
          //<Text style={styles.paragraph}>{text}</Text>
        ) : ( <Text style={styles.paragraph}> no location found </Text>
      )
    }
    <View style={styles.container}>
  
    </View>
    </View>
  );
}

function InfoScreen({navigation}) {
  const [showWebview, setShowWebview] = useState(false);
  return (
    <View style={styles.infoscontainer}>
      <View style={styles.container}>
        <Text style={styles.newsBody}>
          5812 Hollywood Blvd, Hollywood, FL 33021 {'\n'}
          Contact information: +19548667435{'\n'} 
          {/* add call access to the phone number */}
        </Text>
        {showWebview ? (
        <WebView source={{ uri: 'https://www.afcurgentcare.com/hollywood/' }} />
      ) : (
      <View style={styles.buttonContainer}>
        <Button title="Open Link" onPress={() => setShowWebview(true)}  color="darkgrey" />
      </View> 
      )}
      </View>
    </View>
  );
}

const Tab = createMaterialBottomTabNavigator();

function App() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
       <Image source={afc_logo} style={styles.logo} />
       <Text style={styles.mainHeading}>American Family Care</Text>
      </View>

      <NavigationContainer>
        <Tab.Navigator tabBarPosition="top"  
          initialRouteName="Home"
          activeColor="red"
          inactiveColor="grey"
          fontFamily="Helvetica"
          barStyle={{ backgroundColor: 'lightgrey', 
          display: 'flex', 
          height: 90, 
          borderTop: '1px red'
          }}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Contact" component={ContactScreen} />
          <Tab.Screen name="Info" component={InfoScreen} />
          <Tab.Screen name="Update" component={UpdateScreen} options={{
            tabBarVisible: false
          }}/>
        </Tab.Navigator>
      </NavigationContainer>


    <View style={styles.footer}> 
      <Text style={styles.footerText}>Built by Alejandro Otaola</Text>
     </View>
  </View>
    
  );
}

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: 'lightgrey'
  },
  logoContainer: {
    flexDirection: 'row', 
    paddingStart: 30,
    paddingEnd: 10,
    paddingBottom: 10,
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: 'red',
  },
  mainHeading: {
    fontFamily: 'Helvetica',
    fontSize: 20,                
    fontWeight: '200',           
    color: '#333',               
    letterSpacing: 0.7,          
    position: 'absolute', 
    bottom: 10,
    left: 100
  },
  infoscontainer: {
    flex:1,
    alignItems: 'center'
  },
  primaryButton: {
    backgroundColor: '#D32F2F', // A shade of red
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  paragraph: {
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
  },
  newsTitle: {
    padding: 10,
    fontSize: 30,
    fontFamily: 'Helvetica',
    backgroundColor: 'white',
  },
  newsBody: {
    paddingTop: 10,
    fontSize: 15,
    fontFamily: 'Helvetica',
    backgroundColor: 'white',
  },
  newsError: {
    padding: 10,
    fontSize: 20,
    fontFamily: 'Helvetica',
    backgroundColor: 'white',
  },
  header: {
    fontFamily: 'Helvetica',
    backgroundColor: 'lightgrey',
    textColor: 'red',
  },
  headerTitle: {
    fontFamily: 'Helvetica',
    color: 'red',
    fontWeight: 'bold',
  },
  buttons: {
    backgroundColor: 'blue',
    color: 'white'
  },
  logo: {
    padding: 10,
    width: 50,
    height: 50,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 30,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: 'Helvetica',
    color: 'black',
    letterSpacing: 0.7,  
    fontSize: 10,
    position: 'absolute',
    top:5
  },
});


export default App;

