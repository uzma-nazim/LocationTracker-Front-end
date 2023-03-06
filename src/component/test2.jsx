// import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
// const MapWithMarkers = withScriptjs(withGoogleMap((props) => {

// <MapWithMarkers
//   googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDj8QiKUowTVNp29whHKnhZK0noNI53JnA`}
//   loadingElement={<div style={{ height: `100%` }} />}
//   containerElement={<div style={{ height: `400px` }} />}
//   mapElement={<div style={{ height: `100%` }} />}
//   latitude={40.712776}
//   longitude={-74.005974}
//   markers={[
//     { latitude: 40.712776, longitude: -74.005974 },
//     { latitude: 41.878113, longitude: -87.629799 },
//     { latitude: 34.052235, longitude: -118.243683 },
//   ]}
// />

//     return (
//       <GoogleMap
//         defaultZoom={8}
//         defaultCenter={{ lat: props.latitude, lng: props.longitude }}
//       >
//         {props.markers.map((marker, index) => (
//           <Marker key={index} position={{ lat: marker.latitude, lng: marker.longitude }} />
//         ))}
//       </GoogleMap>
//     );
//   }));

//   export default MapWithMarkers;

import React, { Component } from "react";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import axios from "axios";

// // ...

export class MapContainer extends Component {
  // ...
  state = {
    location: null,
  };


  componentDidMount() {
    axios
      .get("http://139.59.16.161:3000/api/latLong")
      .then((res) => {
        console.log(res.data);
        this.setState({ location: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  componentDidUpdate() {
    console.log(this.state.location);
  }

  render() {
    return (
      <>
        <Map
          google={this.props.google}
          zoom={20}
          style={{ width: "100%" }}
          center={{
            lat: 33.50432515320862,
            lng: 73.07035310502653,
          }}
        >
          {this.state.location &&
            this.state.location.map((item, ind) => (
              <Marker
                key={ind}
                position={{
                  lat: item.location.coords.latitude,
                  lng: item.location.coords.longitude,
                }}
                name={"Kenyatta International Convention Centre"}
              />
            ))}
        </Map>
      </>
    );
  }
}

export default GoogleApiWrapper((props) => ({
  apiKey: "AIzaSyDj8QiKUowTVNp29whHKnhZK0noNI53JnA",
}))(MapContainer);

// import React, { useEffect, useState } from "react";
// import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
// import axios from "axios";

// function MapContainer(props) {
//   const [location, setlocation] = useState();

//   useEffect(() => {
//     axios
//       .get("http://139.59.16.161:3000/api/latLong")
//       .then((res) => {
//         console.log(res);
//         setlocation(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);
//   return (
//     <>
//       {location ? (
//         <>
//           <Map
//             google={props.google}
//             zoom={14}
//             style={{ width: "100%" }}
//             // initialCenter={{
//             //   lat: -1.2884,
//             //   lng: 36.8233,
//             // }}
//             center={{
//               lat: location[0].location.coords.latitude,
//               lng: location[0].location.coords.longitude,
//             }}
//           >
//             <Marker
//               position={{
//                 lat: location[0].location.coords.latitude,
//                 lng: location[0].location.coords.longitude,
//               }}
//             />
//             <Marker
//               position={{
//                 lat: location[1].location.coords.latitude,
//                 lng: location[1].location.coords.longitude,
//               }}
//             />
//             {/* {location &&
//               location.map((item, ind) => {
//                 return (
//                   <Marker
//                     key={ind}
//                     position={{
//                       lat: item.location.coords.latitude,
//                       lng: item.location.coords.longitude,
//                     }}
//                   />
//                 );
//               })} */}
//           </Map>
//         </>
//       ) : null}
//     </>
//   );
// }

// export default GoogleApiWrapper({
//   apiKey: "AIzaSyDj8QiKUowTVNp29whHKnhZK0noNI53JnA",
// })(MapContainer);
