// import axios from "axios";
// import { useEffect, useRef, useState } from "react";
// import { w3cwebsocket as W3CWebSocket } from "websocket";
// import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

// function Customer(props) {
//   const socket = io.connect("http://localhost:5000");
//   const [location, setLocation] = useState(null);
//   const [driverlocation, setdriverlocation] = useState(null);
//   const [databaselocation, setdatabaselocation] = useState(null);
//   const [getLocation, setdgetLocation] = useState(null);

//   const handleAllowLocation = () => {
//     navigator.geolocation.getCurrentPosition(
//       (position) =>
//         setLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         }),
//       (error) => {}
//     );
//   };

//   socket.on("rcvLoaction",driverlocation=>{
//     const location= driverlocation
//     console.log(driverlocation)
//     // setdriverlocation(location)
//     setLocation(driverlocation)

//   })

//   useEffect(() => {
//     handleAllowLocation();
//   }, []);
//   const initialRender = useRef(true)
//   useEffect(() => {
//     if(initialRender.current){
//         initialRender.current = false
//         return
//     }

//   }, []);

//   const handleCreate = () => {
//     console.log("create");
//     socket.emit("create-delivery", location)
//   };

//   return (
//     <h1>
//       customer
//       <button onClick={handleCreate}>Create Delivery</button>
//       <Map
//         style={{ width: "600px", height: "600px" }}
//         center={location}
//         google={props.google}
//         zoom={14}
//       >
//         <Marker
//           title={"The marker`s title will appear as a tooltip."}
//           name={"Customer"}
//           position={location}
//         />
//         <Marker
//           icon={{
//             url: "https://cdn-icons-png.flaticon.com/512/66/66841.png",
//             scaledSize: new props.google.maps.Size(55, 55),
//           }}
//           title={"The marker`s title will appear as a tooltip."}
//           name={"Driver"}
//             position={driverlocation}
//         />

//         <InfoWindow>
//           <div>karachi</div>
//         </InfoWindow>
//       </Map>
//     </h1>
//   );
// }

// // export default App;
// export default GoogleApiWrapper({
//   apiKey: "AIzaSyDj8QiKUowTVNp29whHKnhZK0noNI53JnA",
//   v: "3.30",
// })(Customer);
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
  const [location, setLocation] = useState(null);
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
    console.log("create");
    socket.emit("create-delivery", location);
  };
  useEffect(() => {
    handleAllowLocation();
    socket.on("rcvLoaction", (driverlocation) => {
      setcheckDriverLocation(true);

      const location = driverlocation;

      setdriverlocation(driverlocation);
    });
  }, []);
  const initialRender = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    handleCreate();


  }, [location]);
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDj8QiKUowTVNp29whHKnhZK0noNI53JnA",
  });

  const [map, setMap] = useState(null);

  const [path, setPath] = useState([]);

  useEffect(() => {
    if (!isLoaded || loadError) return;
console.log("run" ,location ,driverlocation)
    const directionsService = new window.google.maps.DirectionsService();

    const request = {
      origin: new window.google.maps.LatLng(location),
      destination: new window.google.maps.LatLng(driverlocation),
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        setPath(result.routes[0].overview_path.map(point => ({ lat: point.lat(), lng: point.lng() })));
      }
    });
  }, [window.google, location, driverlocation]);
  return isLoaded ? (
    <>
      <button onClick={handleCreate}>Create</button>
      <GoogleMap
        center={driverlocation ? driverlocation : location}
        zoom={5}
        mapContainerStyle={{ width: "100%", height: "60vh" }}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
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
       {path.length > 0 && <Polyline path={path} strokeColor="#FF0000" strokeOpacity={1} strokeWeight={3} />}

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
