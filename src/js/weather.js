import { createHourlyCards, createDailyCards } from "./Cards.js";
import { startLoadingState, endLoadingState } from "./setLoadingState.js";
import { currentWeatherData } from "./currentWeatherData.js";
import { weatherForecastData } from "./Data.js";

const API_KEY = '9b67329ff531ed297c367b92400ec081';


const searchBoxInput = document.querySelector(".search-box-input");
const gpsButton = document.querySelector(".gps-button");
const ctaButton = document.querySelector(".cta-button");
const topButton = document.querySelector(".top-button");

createHourlyCards();
createDailyCards();

const fetchWeatherData = async (data) => {
  try {
    await startLoadingState();
    await currentWeatherData(data, API_KEY);
    await weatherForecastData(data, API_KEY);
    await endLoadingState();
  } catch (error) {
    if (error.message === "Failed to fetch") {
      await handleError(
        "Uh oh! It looks like you're not connected to the internet. Please check your connection and try again.",
        "Refresh Page"
      );
    } else {
      await handleError(error.message, "Try Again");
    }
  }
};

const getUserLocation = async () => {
  const successCallback = async (position) => {
    const data = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };

    await fetchWeatherData(data);
  };

  const errorCallback = (error) => {
    console.log(error);
    fetchWeatherData("Istanbul");
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

searchBoxInput.addEventListener("keyup", async (event) => {
  if (event.keyCode === 13) {
    await fetchWeatherData(searchBoxInput.value);
  }
});

gpsButton.addEventListener("click", getUserLocation);

ctaButton.addEventListener("click", () => {
  window.open("https://github.com/joaofbfrade");
});

topButton.addEventListener("click", scrollToTop);

getUserLocation();
