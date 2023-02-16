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
  const center = {
    lat: 7.8731,
    lng: 80.7718,
  };

  const [customerLocation, setcustomerLocation] = useState(null);
  const [test, settest] = useState(true);

  const [driverLocation, setdriverLocation] = useState(null);
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
    console.log("driver Location");
  }, [customerLocation]);
  const handleAllowLocation = () => {
    navigator.geolocation.watchPosition(successCallback, errorCallback);
    function successCallback(position) {
      const { accuracy, latitude, longitude, altitude, heading, speed } =
        position.coords;

      // Show a map centered at latitude / longitude.
      console.log(latitude);
      socket.emit("driverLocation", { lat: latitude, lng: longitude });

      setdriverLocation({ lat: latitude, lng: longitude });
    }
    function errorCallback(error) {}
    // navigator.geolocation.getCurrentPosition(
    //   (position) =>
    //     setLocation({
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude,
    //     }),
    //   (error) => {}
    // );
  };
  useEffect(() => {
    handleAllowLocation();
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setdriverLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      (error) => {}
    );
  }, []);

  let onMarkerDragEnd = (coord, index, markers) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    console.log(lng, lat);
    socket.emit("driverLocation", { lat, lng });

    setdriverLocation({ lat, lng });

    // if(lat==customerLocation.lat&& lng==customerLocation.lng){

    // }
  };
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDj8QiKUowTVNp29whHKnhZK0noNI53JnA",
  });
  const [path, setPath] = useState([]);

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
        setPath(
          result.routes[0].overview_path.map((point) => ({
            lat: point.lat(),
            lng: point.lng(),
          }))
        );
      }
    });
  }, [window.google, customerLocation, driverLocation]);
  return isLoaded ? (
    <div>
      Driver
      {/* <Map
        style={{ width: "600px", height: "600px" }}
        google={props.google}
        zoom={14}
        center={customerLocation}
      >
        <Marker
          icon={{
            url: "https://cdn-icons-png.flaticon.com/512/66/66841.png",
            scaledSize: new props.google.maps.Size(55, 55),
          }}
          draggable={true}
          title={"The marker`s title will appear as a tooltip."}
          name={"SOMA"}
          position={driverLocation}
          onDragend={(t, map, coord) => onMarkerDragEnd(coord)}
        />
        <Marker
         icon={{
            url: "https://www.seekpng.com/png/detail/41-410093_circled-user-icon-user-profile-icon-png.png",
            scaledSize: new props.google.maps.Size(55, 55),
          }}
          
          title={"The marker`s title will appear as a tooltip."}
          name={"Customer"}
          position={customerLocation}
          
        />

        <InfoWindow>
          <div>karachi</div>
        </InfoWindow>
      </Map> */}
      <GoogleMap
        center={customerLocation ? customerLocation : driverLocation}
        zoom={5}
        mapContainerStyle={{ width: "100%", height: "60vh" }}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
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
          draggable={true}
          title={"The marker`s title will appear as a tooltip."}
          name={"SOMA"}
          position={driverLocation}
          onDrag={(coord) => {
            onMarkerDragEnd(coord);
          }}
        />
        {path.length > 0 && (
          <Polyline
            path={path}
            strokeColor="#FF0000"
            strokeOpacity={1}
            strokeWeight={3}
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
