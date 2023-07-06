import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Contact from './pages/Contact';
import { Deals } from './pages/Deals';
import { Favourites } from './pages/Favourites';
import { Locations } from './pages/Locations';
import PreviousOrders from './pages/PreviousOrders';
import { Settings } from './pages/Settings';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import YourBasket from './pages/YourBasket';
import Chat from './pages/Chat';
import DefaultLayout from './components/DefaultLayout';


function App() {
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/favourite" element={<Favourites />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/previousorders" element={<PreviousOrders />} />
        <Route path="/setting" element={<Settings />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/yourbasket" element={<YourBasket />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>

    </div>
  );
}

export default App;
