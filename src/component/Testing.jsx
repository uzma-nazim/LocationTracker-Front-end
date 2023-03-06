import * as React from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

function Testing() {
  const [location, setlocation] = useState();

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
  return (
    <div className="App">
      <Map
        mapLib={maplibregl}
        initialViewState={{
          longitude: 73.07035310502653,
          latitude: 33.50432515320862,
          zoom: 14,
        }}
        style={{ width: "100%", height: " calc(100vh - 77px)" }}
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=rmxN2Im4nm5fVGhRz80v"
      >
        <NavigationControl position="top-left" />
        <Marker latitude={33.50432515320862} longitude={73.07035310502653} />
        {location &&
          location.map((item, ind) => {
            return (
              <Marker
                latitude={item.location.coords.latitude}
                longitude={item.location.coords.longitude}
              />
            );
          })}
      </Map>
    </div>
  );
}

export default Testing;
