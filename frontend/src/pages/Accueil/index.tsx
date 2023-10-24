import { Box, Flex, Spinner, Text, useToast, Image } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Widget from "../../components/Widget";
import WidgetCreation from "../../components/WidgetCreation";
import { EWidgetSize, IWidget } from "../../models/widget";
import bgImage from "/assets/image/Gradient Background.jpg";

const HomePage: React.FC = () => {
  const { id } = useParams();

  const [widgets, setWidgets] = useState<IWidget[]>([]);
  const [loadingWidgets, setLoadingWidgets] = useState(true);
  const [loadingCreateWidgets, setLoadingCreateWidgets] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDateRef = useRef(selectedDate);
  selectedDateRef.current = new Date(0);

  const [taille, setTaille] = useState("SMALL");
  const [ville, setVille] = useState("");

  const [dashboardUserName, setDashboardUserName] = useState<string>();

  const toast = useToast();

  const getWigets = async (id?: string) => {
    const widgets: IWidget[] = [];
    const token = localStorage.getItem("token");

    if (id) {
      const userResponse = await fetch(`https://meteoplus.fly.dev/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "*",
          "Access-Control-Allow-Origin": "*",
        },
      });
      const users = await userResponse.json();
      const user = users.find((user: any) => user.id == +id && Object.prototype.hasOwnProperty.call(user, "widgets"));

      if (!user) {
        toast({
          title: "L'utilisateur n'a pas été trouvé",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setDashboardUserName(user.name);
      widgets.push(...user.widgets);
    } else {
      const response = await fetch("https://meteoplus.fly.dev/widgets", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "*",
          "Access-Control-Allow-Origin": "*",
        },
      });

      const data = await response.json();

      widgets.push(...data);
    }

    setWidgets(widgets);

    setLoadingWidgets(false);

    if (widgets.length === 0) {
      createDefaultWidget();
      return;
    }

    const newWidgets = await Promise.all(
      widgets.map(
        async (widget: {
          id: number;
          size: EWidgetSize;
          displayName: string;
          latitude: number;
          longitude: number;
        }): Promise<IWidget> => {
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
        },
      ),
    );
    setWidgets(newWidgets);
  };

  const getWeather = async (lat: number | string, long: number | string) => {
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

  const removeWidget = (index: number) => {
    const newWidgets = [...widgets];
    newWidgets.splice(index, 1);
    setWidgets(newWidgets);
  };

  const createDefaultWidget = () => {
    if (widgets.length > 0) return;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLoadingWidgets(true);

        setWidgets([
          {
            id: 0,
            displayName: "Ma position",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            size: EWidgetSize.MEDIUM,
          } as IWidget,
        ]);

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
            displayName: "Ma position",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            size: EWidgetSize.MEDIUM,
          }),
        });

        await getWigets();

        toast({
          title: "Géolocalisation trouvée",
          description: "Un widget par défaut a été créé",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      () => {
        toast({
          title: "La géolocalisation n'a pas été trouvée",
          description: "Veuillez autoriser la géolocalisation pour créer un widget par défaut",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  };

  useEffect(() => {
    if (selectedDateRef.current === selectedDate) return;
    selectedDateRef.current = selectedDate;
    getWigets(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, id]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <Box>
      <Image src={bgImage} position={"fixed"} zIndex={-1} />

      <Navbar onDateChange={handleDateChange} dashboardName={dashboardUserName} />

      <Flex display="flex" justify="space-evenly" flexWrap="wrap" align="center">
        {loadingWidgets ? (
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
        ) : widgets.length > 0 ? (
          widgets.map((widget: any, index: number) => (
            <Widget key={index} widget={widget} index={index} removeWidget={removeWidget} canBeDeleted={!id} />
          ))
        ) : (
          <Text>Vous n'avez pas encore de widgets.</Text>
        )}

        {!id && (
          <WidgetCreation
            loadingCreateWidgets={loadingCreateWidgets}
            createWidget={createWidget}
            taille={taille}
            setTaille={setTaille}
            ville={ville}
            setVille={setVille}
          />
        )}
      </Flex>
    </Box>
  );
};

export default HomePage;
