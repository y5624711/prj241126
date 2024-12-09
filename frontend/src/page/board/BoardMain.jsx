import {
  Box,
  Heading,
  IconButton,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import { toaster } from "../../components/ui/toaster.jsx";
import weatherCityMapFromKr from "../../components/data/weatherCityMapFromKr.json";
import { WeatherCard } from "../../components/root/WeatherCard.jsx";
import Slider from "react-slick";
import { IoIosArrowUp } from "react-icons/io";

import "../../components/css/WeatherApp.css";

function NexArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", backgroundColor: "green" }}
      onClick={onClick}
    />
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    />
  );
}

export function BoardMain() {
  const [cityName, setCityName] = useState("");
  const [weather, setWeather] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const appKey = import.meta.env.VITE_WEATHER_API_KEY;

  // useEffect(() => {
  //   SearchWeatherByCity(cityName);
  // }, []);

  const getEnglishCityName = (koreanCityName) => {
    return weatherCityMapFromKr[koreanCityName] || koreanCityName;
  };

  const categories = [
    { name: "가전제품", src: "src/components/Image/가전제품.jpg" },
    { name: "생활용품", src: "src/components/Image/생활용품.jpg" },
    { name: "학용품", src: "src/components/Image/학용품.jpg" },
    { name: "의류", src: "src/components/Image/의류.jpg" },
    { name: "스포츠용품", src: "src/components/Image/스포츠용품.jpg" },
    { name: "도서", src: "src/components/Image/도서.jpg" },
  ];

  const sliderSettings = {
    arrows: true,
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 4,
    slidesToScroll: 2,
    nextArrow: <NexArrow />,
    prevArrow: <PrevArrow />,
  };

  function handleClick(category) {
    console.log(`${category} 클릭`);
  }

  // 날씨 초기화
  const SearchWeatherByCity = async (city) => {
    try {
      const engCityName = getEnglishCityName(city);

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${engCityName}&appid=${appKey}&lang=kr&unit=metric`;

      const response = await fetch(url);

      if (!response.ok) {
        toaster.create({
          type: "error",
          description: "제대로된 도시명, 시를 붙여 입력하세요",
        });
        return;
      }
      const data = await response.json();
      setWeather(data);
      setIsOpen(true);
    } catch (e) {
      toaster.create({
        type: "error",
        description: "제대로된 도시명, 시를 붙여 입력하세요",
      });
      setWeather(null);
    }
  };

  const HandleInputCity = (e) => {
    if (e.key === "Enter") {
      SearchWeatherByCity(cityName);
    }
  };

  function handleButtonClose() {
    setIsOpen(false);
    setTimeout(() => setWeather(null), 2000);
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box
        boxShadow="lg"
        bg="blue.200"
        maxWidth="400px"
        borderRadius="lg"
        p="5"
        pt="2"
        zIndex={2}
        position={"Fixed"}
      >
        <Heading>Weather</Heading>
        <Stack>
          <Input
            variant="subtle"
            value={cityName}
            textAlign="center"
            fontSize={"25px"}
            placeholder={"도시명을 입력하세요"}
            onChange={(e) => setCityName(e.target.value)}
            onKeyDown={HandleInputCity}
          />

          <div className={`weatherContainer ${isOpen ? "open" : "closed"}`}>
            {weather && <WeatherCard weather={weather} />}

            <IconButton w={"100%"} onClick={handleButtonClose}>
              {/*<IconButton onClick={() => setWeather(null)}>*/}
              <IoIosArrowUp />
            </IconButton>
          </div>
        </Stack>
      </Box>

      <Box w="40%" mt={"200px"} zIndex={1}>
        <Slider {...sliderSettings}>
          {categories.map((category) => (
            <Box
              key={category.name}
              textAlign="center"
              cursor="pointer"
              onClick={() => handleClick(category.name)}
            >
              <Image
                mx="auto"
                w="100px"
                h="100px"
                src={category.src}
                alt={category.name}
              />
              <Text mt="4">{category.name}</Text>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}
