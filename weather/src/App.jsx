import { useEffect, useState } from 'react';
import './App.css';
import PropTypes from "prop-types";

import cloudIcon from "./assets/cloud.png";
import drizzleIcon from "./assets/driz.png";
import humidityIcon from "./assets/humidity.png"
import rainIcon from "./assets/rain.png";
import searchIcon from "./assets/search.png";
import snowIcon from "./assets/snow.png";
import sunIcon from "./assets/sun.png";
import windIcon from "./assets/wind.png";

const WeatherDetails = ({icon,temp,city,country,lat,log,humidity,wind})=>{
  return(
  <>
  <div className="image">
    <img src={icon} alt="Image" />
  </div>
  <div className="temp">{temp}°C</div>
  <div className="location">{city}</div>
  <div className="country">{country}</div>
  <div className="cord">
    <div>
    <span className="lat">latitude</span>
    <span>{lat}</span>
    </div>
    <div>
    <span className="log">longitude</span>
    <span>{log}</span>
    </div>
  </div>
  <div className="datacontainer">
    <div className="element">
      <img src={humidityIcon} alt="Humidity" width={40} height={40} className="icon" />
      <div className="data">
        <div className="percent">{humidity}%</div>
        <div className="text">Humidity</div>
      </div>
    </div>
    <div className="element">
      <img src={windIcon} alt="Wind" width={50} height={50} className="icon" />
      <div className="data">
        <div className="windpercent">{wind}km/h</div>
        <div className="text">Windspeed</div>
      </div>
    </div>
  </div>
  </>
  );
};

WeatherDetails.propTypes={
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  wind: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
};

function App(){
  let api_key="d09f5ffb548e881ca236d853bb0f5af4";
  const [text,setText] = useState("Chennai");
  const [icon,setIcon] = useState(cloudIcon);
  const [temp,setTemp] = useState(0);
  const [city,setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity,setHumidity] = useState(0)
  const [wind,setWind] = useState(0)
  const [cityNotFound,setCityNotFound] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);

  const weatherConditionMap={
    "01d": sunIcon,
    "01n": sunIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d" :rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  }

  const search = async ()=> {
    setLoading(true);
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`
  
  
  try{
    const res= await fetch(url);
    const data= await res.json();
    if(data.cod==="404"){
      console.error("City Not Found");
      setCityNotFound(true);
      setLoading(false);
      return;
    }
     
    setHumidity(data.main.humidity);
    setWind(data.wind.speed);
    setTemp(Math.floor(data.main.temp));
    setCity(data.name);
    setCountry(data.sys.country);
    setLat(data.coord.lat);
    setLog(data.coord.lon);
    const weatherMapCode = data.weather[0].icon;
    setIcon(weatherConditionMap[weatherMapCode] || sunIcon);
    setCityNotFound(false);
  }
  catch(error){
     console.error("An error occured",error.message);
     setError("Error while fetching weather data");
  }
  finally{
    setLoading(false);
  }
};

  const handleCity=(e)=>{
    setText(e.target.value);
  };
  
  const handleKeyDown=(e)=>{
    if(e.key === "Enter"){
      search();
    }
  };

  useEffect( function(){
    search();
  },[]);

 return ( 
    <>
      <div className="container">
        <div className="input-container">
          <input type="text" className="cityinput" placeholder='SearchCity' onChange={handleCity} value={text} onKeyDown={handleKeyDown} />
          <div className="searchicon" onClick={()=> search()} >
            <img src={searchIcon}  alt="Search" height={14} width={14} color="#ccc"/>
          </div>
        </div>
      

      {loading && <div className="loadingmessage">...Loading</div>}
      {error && <div className="errormessage">{error}</div>}
      {cityNotFound && <div className="citynotfound">City not found</div>}

      {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity}
      wind={wind}/>}
      <p className="copy">Designed by <b>Ariprasanth</b></p>
      </div>
      
    </>
  
  )
}

export default App;
