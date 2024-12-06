import { Box, Heading, Image, Text } from "@chakra-ui/react";
import { weatherDescriptions } from "../data/WeatherDescriptions.jsx";

export const WeatherCard = ({ weather }) => {
  const { name, main, weather: weatherDetails } = weather;
  // const trans = weatherDescriptions;

  const getWeather = (weatherId) => {
    return weatherDescriptions[weatherId] || "알 수 없는 날씨";
  };

  //날씨코드 번역
  const transWeather = getWeather(weatherDetails[0].id);
  const wIcon = weatherDetails[0].icon;
  const wIconUrl = `https://openweathermap.org/img/wn/${wIcon}@2x.png`;

  return (
    <Box p="6" textAlign="center">
      <Heading size="lg" mb="4">
        {name}
      </Heading>
      <Image mx={"auto"} src={wIconUrl} />
      <Text> {transWeather}</Text>
      <Text fontSize="2xl" fontWeight="bold">
        {Math.round(main.temp - 273.15)}°C
      </Text>
      <Text>습도: {main.humidity}%</Text>
    </Box>
  );
};