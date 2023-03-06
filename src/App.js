import Customer from "./component/customer";
import Driver from "./component/driver";
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Test from "./component/Test";
import MapContainer from "./component/test2";
import MapWithMarkers from "./component/test2";
import Testing from "./component/Testing";
function App(props) {
  return (
    <div>
      
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Test />} />
          <Route exact path="/test" element={<MapWithMarkers />} />
          <Route exact path="/testing" element={<Testing />} />
          <Route exact path="/customer" element={<Customer />} />
          <Route exact path="/driver" element={<Driver />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// export default App;
export default App;
