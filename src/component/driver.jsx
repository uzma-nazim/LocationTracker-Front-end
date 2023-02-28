import axios from "axios";
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
// import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
function Driver(props) {


  const [customerLocation, setcustomerLocation] = useState(null);
  const [test, settest] = useState(true);

  const [driverLocation, setdriverLocation] = useState({
    lat:24.8532,
    lng: 67.0167,
  });
  const [databaselocation, setdatabaselocation] = useState(null);
  const [getLocation, setdgetLocation] = useState(null);
  // const socket = io.connect("http://localhost:5000");
  const socket = io.connect(BASE_URI);
  socket.on("delivery-send", (customerLocation) => {
    console.log(customerLocation);
    setcustomerLocation(customerLocation);
  });
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    socket.emit("driverLocation", driverLocation);
    console.log("driver Location" , driverLocation);
  }, [customerLocation]);
  const handleAllowLocation = () => {
    navigator.geolocation.watchPosition(successCallback, errorCallback);
    function successCallback(position) {
      const { accuracy, latitude, longitude, altitude, heading, speed } =
        position.coords;
        
      socket.emit("driverLocation", { lat: latitude, lng: longitude });      
    }
    function errorCallback(error) {}

  };
  useEffect(() => {
    handleAllowLocation();
    navigator.geolocation.getCurrentPosition(
      (position) =>{
      console.log(position.coords.latitude)
        setdriverLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })}
      
    );
  }, []);

  // let onMarkerDragEnd = (coord, index, markers) => {
  //   const { latLng } = coord;
  //   const lat = latLng.lat();
  //   const lng = latLng.lng();
  //   console.log(lng, lat);
  //   socket.emit("driverLocation", { lat, lng });

  //   setdriverLocation({ lat, lng });

  
  // };
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDj8QiKUowTVNp29whHKnhZK0noNI53JnA",
  });
  const [path, setPath] = useState([]);
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (!isLoaded || loadError) return;

    const directionsService = new window.google.maps.DirectionsService();

    const request = {
      origin: new window.google.maps.LatLng(customerLocation),
      destination: new window.google.maps.LatLng(driverLocation),
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        setDirections(result);
      }
    });
  }, [window.google, customerLocation, driverLocation]);
  return isLoaded ? (
    <div>
      Driver
     
      <GoogleMap
        center={customerLocation ? customerLocation : driverLocation}
        zoom={25}
        mapContainerStyle={{ width: "100%", height: "100vh" }}
 
      >
        <Marker
          icon={{
            // path: google.maps.SymbolPath.CIRCLE,
            url: require("../Assets/user.png"),
            fillColor: "#EB00FF",
            scale: 0,
            scaledSize: new window.google.maps.Size(42, 42),
            width: "10px",
          }}
          position={customerLocation}
        />

        <Marker
          icon={{
            url: require("../Assets/del.png"),

            scaledSize: new window.google.maps.Size(42, 42),
          }}
          
          title={"The marker`s title will appear as a tooltip."}
          name={"SOMA"}
          position={driverLocation}
          // onDrag={(coord) => {
          //   onMarkerDragEnd(coord);
          // }}
        />
        {/* {path.length > 0 && (
          <Polyline
            path={path}
            strokeColor="#FF0000"
            strokeOpacity={1}
            strokeWeight={3}
          />
        )} */}
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
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
}

// export default App;
export default Driver;
