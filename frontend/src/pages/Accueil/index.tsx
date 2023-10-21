import { Box, Flex, Image, Spinner, Text, useToast } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../../components/Navbar";
import Widget from "../../components/Widget";
import WidgetCreation from "../../components/WidgetCreation";

const HomePage: React.FC = () => {
  const [widgets, setWidgets] = useState<any[]>([]);
  const [loadingWidgets, setLoadingWidgets] = useState(true);
  const [loadingCreateWidgets, setLoadingCreateWidgets] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [taille, setTaille] = useState("SMALL");
  const [ville, setVille] = useState("");

  const toast = useToast();

  const getWigets = useCallback(async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("https://meteoplus.fly.dev/widgets", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "*",
        "Access-Control-Allow-Origin": "*",
      },
    });

    const widgets: any[] = await response.json();

    setWidgets(widgets);

    setLoadingWidgets(false);

    if (widgets.length === 0) return;
    setWidgets(
      await Promise.all(
        widgets.map(async (widget: { id: number; displayName: string; latitude: string; longitude: string }) => {
          const weather = await getWeather(widget.latitude, widget.longitude);

          const year = selectedDate.getFullYear();
          const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
          const day = selectedDate.getDate().toString().padStart(2, "0");
          const hours = selectedDate.getHours().toString().padStart(2, "0");

          const date = `${year}-${month}-${day}T${hours}:00`;

          const i = weather.hourly.time.indexOf(date) + 1;

          return {
            ...widget,
            temperature: weather.hourly.temperature_2m[i],
            humidity: weather.hourly.relativehumidity_2m[i],
            wind: weather.hourly.windspeed_10m[i],
            isSunny: weather.hourly.weathercode[i] >= 0 && weather.hourly.weathercode[i] <= 3,
            isCloudy: weather.hourly.weathercode[i] >= 4 && weather.hourly.weathercode[i] <= 60,
            isRainy: weather.hourly.weathercode[i] >= 61 && weather.hourly.weathercode[i] <= 86,
            isStormy: weather.hourly.weathercode[i] >= 87 && weather.hourly.weathercode[i] <= 99,
          };
        }),
      ),
    );
  }, [selectedDate]);

  const getWeather = async (lat: string, long: string) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&timezone=Europe%2FLondon`,
      {
        method: "GET",
      },
    );

    return await response.json();
  };

  const getCity = async () => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${ville}&count=1&language=fr&format=json`,
      );
      const data = await response.json();

      return data.results?.[0];
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const createWidget = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoadingCreateWidgets(true);

    const city = await getCity();

    if (!city) {
      setLoadingCreateWidgets(false);

      toast({
        title: "La ville n'a pas été trouvé",
        status: "error",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    const token = localStorage.getItem("token");

    await fetch("https://meteoplus.fly.dev/widgets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "*",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude: city.latitude,
        longitude: city.longitude,
        size: taille,
        displayName: `${city.name}${city.country ? ` (${city.country})` : ""}`,
      }),
    });

    await getWigets();

    setLoadingCreateWidgets(false);
  };

  useEffect(() => {
    getWigets();
  }, [selectedDate, getWigets]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <Box>
      <Image
        src={"assets/image/Beautiful Weather.jpg"}
        position={"absolute"}
        zIndex={-10}
        h={"100vh"}
        w={"100%"}
      ></Image>

      <Navbar onDateChange={handleDateChange} />

      <Flex display="flex" justify="space-evenly" flexWrap="wrap" align="center">
        {loadingWidgets ? (
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        ) : widgets.length > 0 ? (
          widgets.map((widget: any, index: number) => <Widget key={index} widget={widget} index={index} />)
        ) : (
          <Text>Vous n'avez pas encore de widgets.</Text>
        )}

        <WidgetCreation
          loadingCreateWidgets={loadingCreateWidgets}
          createWidget={createWidget}
          taille={taille}
          setTaille={setTaille}
          ville={ville}
          setVille={setVille}
        />
      </Flex>
    </Box>
  );
};

export default HomePage;
