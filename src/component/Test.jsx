// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, DirectionsRenderer, useLoadScript } from '@react-google-maps/api';

// const libraries = ['places'];

// function Test() {
//   const [map, setMap] = useState(null);
//   const [user1Position, setUser1Position] = useState({lat: 24.9517, lng:  67.0023});
//   const [user2Position, setUser2Position] = useState({lat:33.6844, lng:  73.0479});
//   const [directions, setDirections] = useState(null);

//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: 'AIzaSyDj8QiKUowTVNp29whHKnhZK0noNI53JnA',
//     libraries
//   });

//   // useEffect(() => {
//   //   if (isLoaded && user1Position && user2Position) {
//   //     const directionsService = new window.google.maps.DirectionsService();

//   //     const request = {
//   //       origin: new window.google.maps.LatLng(user1Position),
//   //       destination: new window.google.maps.LatLng(user2Position),
//   //       travelMode: window.google.maps.TravelMode.DRIVING,
//   //     };

//   //     directionsService.route(request, (result, status) => {
//   //       if (status === window.google.maps.DirectionsStatus.OK) {
//   //         setDirections(result);
//   //       }
//   //     });
//   //   }
//   // }, [isLoaded, user1Position, user2Position]);

//   useEffect(() => {
//     if (isLoaded && user1Position && user2Position) {
//       const directionsService = new window.google.maps.DirectionsService();

//       const request = {
//         origin: new window.google.maps.LatLng(user1Position),
//         destination: new window.google.maps.LatLng(user2Position),
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       };

//       directionsService.route(request, (result, status) => {
//         if (status === window.google.maps.DirectionsStatus.OK) {
//           setDirections(result);

//           // Zoom to fit the direction bounds
//           const bounds = new window.google.maps.LatLngBounds();
//           result.routes[0].legs.forEach((leg) => {
//             leg.steps.forEach((step) => {
//               step.path.forEach((point) => {
//                 bounds.extend(point);
//               });
//             });
//           });
//           map.fitBounds(bounds);
//         }
//       });
//     }
//   }, [isLoaded, user1Position, user2Position, map]);

//   return isLoaded ? (
//     <GoogleMap
//       mapContainerStyle={{width:"100%", height:"100vh"}}
//       center={user1Position}
//       zoom={23}

//       onLoad={map => setMap(map)}
//     >
//       <Marker position={user1Position}  />
//       <Marker position={user2Position} />
//       {directions && <DirectionsRenderer directions={directions} />}
//     </GoogleMap>
//   ) : null;
// }

// export default Test;
import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
import axios from "axios";

const libraries = ["places"];

function Test() {
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(14);
  const [location, setlocation] = useState();

  const mapRef = useRef();
  const [user1Position, setUser1Position] = useState({
    lat: 24.9517,
    lng: 67.0023,
  });
  const [user2Position, setUser2Position] = useState({
    lat: 33.6844,
    lng: 73.0479,
  });
  const [directions, setDirections] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDj8QiKUowTVNp29whHKnhZK0noNI53JnA",
    libraries,
  });

  // useEffect(() => {
  //   if (isLoaded && user1Position && user2Position) {
  //     const directionsService = new window.google.maps.DirectionsService();

  //     const request = {
  //       origin: new window.google.maps.LatLng(user1Position),
  //       destination: new window.google.maps.LatLng(user2Position),
  //       travelMode: window.google.maps.TravelMode.DRIVING,
  //     };

  //     directionsService.route(request, (result, status) => {
  //       if (status === window.google.maps.DirectionsStatus.OK) {
  //         setDirections(result);
  //       }
  //     });
  //   }
  // }, [isLoaded, map, user1Position, user2Position]);

  useEffect(() => {
    axios
      .get("http://139.59.16.161:3000/api/latLong")
      .then((res) => {
        console.log(res);
        setlocation(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return isLoaded ? (
    <>
      {location ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100vh" }}
          center={{
            lat: location[0].location.coords.latitude,
            lng: location[0].location.coords.longitude,
          }}
          zoom={zoom}
          onLoad={(map) => setMap(map)}
          ref={mapRef}
        >
          {location &&
            location.map((item, ind) => {
              return (
                <Marker
     
                  position={{
                    lat: item.location.coords.latitude,
                    lng: item.location.coords.longitude,
                  }}
                />
              );
            })}

          {/* {directions && (
        <DirectionsRenderer
          options={{
            polylineOptions: {
              strokeColor: "red",
            },
            markerOptions: {
              visible: false,
            },
          }}
          directions={directions}
        />
      )} */}
        </GoogleMap>
      ) : null}
    </>
  ) : null;
}

export default Test;
