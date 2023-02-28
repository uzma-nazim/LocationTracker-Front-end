import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  Polyline,
} from "@react-google-maps/api";
import BASE_URI from "../core";

const center = {
  lat: 7.8731,
  lng: 80.7718,
};

function Customer() {


  const [location, setLocation] = useState(  {lat: 33.6844 , lng:73.0479});
  const [driverlocation, setdriverlocation] = useState(null);
  const [databaselocation, setdatabaselocation] = useState(null);
  const [checkDriverLocation, setcheckDriverLocation] = useState(false);

  const socket = io.connect(BASE_URI);
  // const socket = io.connect("http://localhost:5000");

  const handleAllowLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      (error) => {}
    );
  };

  const handleCreate = () => {
    
    socket.emit("create-delivery", location);
  };
  useEffect(() => {
    handleCreate()
    // handleAllowLocation();
    socket.on("rcvLoaction", (driverlocation) => {
      setcheckDriverLocation(true);


      setdriverlocation(driverlocation);
    });
  }, []);
  // const initialRender = useRef(true);
  // useEffect(() => {
  //   if (initialRender.current) {
  //     initialRender.current = false;
  //     return;
  //   }
  //   handleCreate();
  // }, [location]);
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDj8QiKUowTVNp29whHKnhZK0noNI53JnA",
  });

  const [map, setMap] = useState(null);

  const [path, setPath] = useState([]);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (!isLoaded || loadError) return;
    
    const directionsService = new window.google.maps.DirectionsService();

    const request = {
      origin: new window.google.maps.LatLng(location),
      destination: new window.google.maps.LatLng(driverlocation),
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        // setPath(result.routes[0].overview_path.map(point => ({ lat: point.lat(), lng: point.lng() })));
        setDirections(result);
      }
    });
  }, [window.google, location, driverlocation]);
  return isLoaded ? (
    <>
      <p>Customer</p>
      <GoogleMap
        center={driverlocation ? driverlocation : location}
        zoom={25}
        mapContainerStyle={{ width: "100%", height: "100vh" }}
        onLoad={(map) => setMap(map)}
      >
        <Marker
          icon={{
            url: require("../Assets/user.png"),

            scaledSize: new window.google.maps.Size(42, 42),
          }}
          position={location}
        />
        <Marker
          icon={{
            url: require("../Assets/del.png"),

            scaledSize: new window.google.maps.Size(42, 42),
          }}
          position={driverlocation}
        />
    
      {directions && (
        <DirectionsRenderer
        
          options={{
            markerOptions: {
              visible: false,
              
          
            },
          }}
          directions={directions}
        />
      )}
        {/* {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )} */}
      </GoogleMap>
    </>
  ) : (
    <></>
  );
}

export default Customer;
