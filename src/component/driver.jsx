import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
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
  const [map, setmap] = useState(null);
  const [zoom, setzoom] = useState(25);

  const socket = io("https://tracking-app-production.up.railway.app");

  socket.on("connect", function () {});
  socket.on("connect_error", (err) => {});

  const [driverLocation, setdriverLocation] = useState();

  const [driver, setdriver] = useState();

  const handlegetdriver = () => {
    axios
      .get(`${BASE_URI}/user/3`)
      .then((res) => {
        setdriver(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handlegetlocation = () => {
    navigator.geolocation.watchPosition(successCallback, errorCallback, {
      enableHighAccuracy: false,
      maximumAge: 0,
    });
    function successCallback(position) {
      const { accuracy, latitude, longitude, altitude, heading, speed } =
        position.coords;
      console.log(latitude);
      setdriverLocation({
        lat: latitude,
        lng: longitude,
      });
    }
    function errorCallback(error) {}
  };
  useEffect(() => {
    handlegetdriver();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setdriverLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {},
      {
        enableHighAccuracy: false,
        maximumAge: 0,
      }
    );

    setInterval(() => {
      handlegetlocation();
      console.log("runn");
    }, 7000);

    // const paylod = {
    //   userId: driver.id,
    //   lat: driverLocation.lat,
    //   long: driverLocation.lng,
    // };

    // socket.emit("locationUpdate", paylod, (data, err) => {
    //   console.log("data", data);
    //   console.log("err", err);
    //   console.log("payload", paylod);
    // });

    // socket.on("locationUpdate", (data) => {
    //   console.log(data);
    // });
  }, []);

  const initilaRender = useRef(true);
  useEffect(() => {
    if (initilaRender.current) {
      initilaRender.current = false;
      return;
    }
    if (driver) {
      const paylod = {
        userId: driver.id,
        lat: driverLocation.lat,
        long: driverLocation.lng,
      };
      console.log(paylod);

      socket.emit("locationUpdate", paylod);

      socket.on("locationUpdate", (data) => {
        console.log("first data", data);
      });
    }
  }, [driverLocation]);

  let onMarkerDragEnd = (coord, index, markers) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();

    const paylod = {
      userId: driver.id,
      lat: lat,
      long: lng,
    };

    socket.emit("locationUpdate", paylod);

    socket.on("locationUpdate", (data) => {
      console.log("data", data);
    });
  };
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDj8QiKUowTVNp29whHKnhZK0noNI53JnA",
  });
  const [path, setPath] = useState([]);
  const [directions, setDirections] = useState(null);
  const count = useRef(0);

  useEffect(() => {
    if (!isLoaded || loadError) return;

    const directionsService = new window.google.maps.DirectionsService();

    // const request = {
    //   origin: new window.google.maps.LatLng(customerLocation),
    //   destination: new window.google.maps.LatLng(driverLocation),
    //   travelMode: window.google.maps.TravelMode.DRIVING,
    // };

    // directionsService.route(request, (result, status) => {
    //   if (status === window.google.maps.DirectionsStatus.OK) {
    //     setDirections(result);
    //   }
    // });
  }, [window.google, customerLocation, driverLocation]);
  return isLoaded ? (
    <div>
      Driver
      <GoogleMap
        onLoad={(map) => setmap(map)}
        center={driverLocation}
        // center={customerLocation ? customerLocation : driverLocation}
        zoom={zoom}
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
          draggable={false}
          title={"The marker`s title will appear as a tooltip."}
          name={"SOMA"}
          position={driverLocation}
          onDragEnd={(coord) => {
            onMarkerDragEnd(coord);
          }}
        />
        {/* {path.length > 0 && (
          <Polyline
            path={path}
            strokeColor="#FF000"
            strokeOpacity={1}
            strokeWeight={3}
          />
        )} */}
        {/* {directions && (
          <DirectionsRenderer
            options={{
              markerOptions: {
                visible: false,
              },
            }}
            directions={directions}
          />
        )} */}
      </GoogleMap>
    </div>
  ) : (
    <></>
  );
}

// export default App;
export default Driver;
