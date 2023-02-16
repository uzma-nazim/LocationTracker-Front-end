import { useState, useEffect } from 'react';
import {  GoogleMap, Marker, Polyline, useJsApiLoader, useLoadScript } from '@react-google-maps/api';

// Define libraries to be loaded
const libraries = ['places'];

function TrackingMap() {
  // State to store user1 position
  const [map, setMap] = useState(null);

  const [user1Position, setUser1Position] = useState({lat: 24.9569449, lng: 66.974658});

  // State to store user2 position
  const [user2Position, setUser2Position] = useState({lat: 24.9517, lng: 67.0873});

  // State to store path between the two positions
  const [path, setPath] = useState([]);

  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDj8QiKUowTVNp29whHKnhZK0noNI53JnA',
    // id: "google-map-script",
    libraries
  });

  // Compute the path between the two positions when the API is loaded and when the user2Position changes
  useEffect(() => {
    console.log(user2Position)
    if (isLoaded && user2Position) {
      const directionsService = new window.google.maps.DirectionsService();

      const request = {
        origin: new window.google.maps.LatLng(user1Position),
        destination: new window.google.maps.LatLng(user2Position),
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setPath(result.routes[0].overview_path.map((point) => ({ lat: point.lat(), lng: point.lng() })));
        }
      });
    }
  }, [isLoaded, user1Position, user2Position]);

  // Render the map with the markers and path when the API is loaded

  return isLoaded ? (

    <>
    <h1>sdd</h1>
    <GoogleMap mapContainerStyle={{width:"500px" , height:"600px"}} center={user1Position} zoom={13}
        
    
    >
      <Marker position={user1Position} />
      <Marker position={user2Position} />
      {path.length > 0 && (
        <Polyline path={path} options={{ strokeColor: '#FF0000', strokeOpacity: 1, strokeWeight: 3 }} />
      )}
    </GoogleMap>
    </>
  ) : null;
}

export default TrackingMap;
