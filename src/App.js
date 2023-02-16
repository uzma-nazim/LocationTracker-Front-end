import Customer from "./component/customer";
import Driver from "./component/driver";
import {BrowserRouter , Routes , Route} from 'react-router-dom'
import Test from "./component/Test";
function App(props) {
  return (
    <div>
      Location Tracker
      {/* <Test /> */}
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Test />} />
          <Route exact path="/customer" element={<Customer />} />
          <Route exact path="/driver" element={<Driver />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// export default App;
export default App;
