import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import image from "../assets/image/Beautiful Weather.jpg";
import cloudy from "../assets/image/icons/cloudy.png";
import rain from "../assets/image/icons/rain.png";
import storm from "../assets/image/icons/storm.png";
import sunny from "../assets/image/icons/sun.png";
import Navbar from "../components/Navbar";

function HomePage() {
  const [widgets, setWidgets] = useState<any[]>([]);
  const [loadingWidgets, setLoadingWidgets] = useState(true);
  const [loadingCreateWidgets, setLoadingCreateWidgets] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [taille, setTaille] = useState("SMALL");
  const [ville, setVille] = useState("");

  const toast = useToast();

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [email, setEmail] = useState("");

  const sendInvit = async () => {
    if (email === "") {
      toast({
        title: "Erreur lors de l'envoi de l'invitation",
        description: "L'adresse mail est vide",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    axios
      .post(
        "https://meteoplus.fly.dev/invits",
        {
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        closeModal();
        toast({
          title: "Invitation envoyée avec succès",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Erreur lors de l'envoi de l'invitation",
          description: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const getWigets = async () => {
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

    setWidgets(
      await Promise.all(
        widgets.map(
          async (widget: {
            id: number;
            displayName: string;
            latitude: string;
            longitude: string;
          }) => {
            const weather = await getWeather(widget.latitude, widget.longitude);

            const year = selectedDate.getFullYear();
            const month = (selectedDate.getMonth() + 1)
              .toString()
              .padStart(2, "0");
            const day = selectedDate.getDate().toString().padStart(2, "0");
            const hours = selectedDate.getHours().toString().padStart(2, "0");

            const date = `${year}-${month}-${day}T${hours}:00`;

            const i = weather.hourly.time.indexOf(date) + 1;

            return {
              ...widget,
              temperature: weather.hourly.temperature_2m[i],
              humidity: weather.hourly.relativehumidity_2m[i],
              wind: weather.hourly.windspeed_10m[i],
              isSunny:
                weather.hourly.weathercode[i] >= 0 &&
                weather.hourly.weathercode[i] <= 3,
              isCloudy:
                weather.hourly.weathercode[i] >= 4 &&
                weather.hourly.weathercode[i] <= 60,
              isRainy:
                weather.hourly.weathercode[i] >= 61 &&
                weather.hourly.weathercode[i] <= 86,
              isStormy:
                weather.hourly.weathercode[i] >= 87 &&
                weather.hourly.weathercode[i] <= 99,
            };
          }
        )
      )
    );
  };

  const getWeather = async (lat: string, long: string) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&timezone=Europe%2FLondon`,
      {
        method: "GET",
      }
    );

    return await response.json();
  };

  const getCity = async () => {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${ville}&count=1&language=fr&format=json`
      );
      const data = await response.json();

      return data.results?.[0];
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const createWidget = async (e: any) => {
    e.preventDefault();
    setLoadingCreateWidgets(true);

    const city = await getCity();

    if (!city) {
      setLoadingCreateWidgets(false);

      return toast({
        title: "La ville n'a pas été trouvé",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
        displayName: `${city.name}${
          !!city.country ? ` (${city.country})` : ""
        }`,
      }),
    });

    await getWigets();

    setLoadingCreateWidgets(false);
  };

  useEffect(() => {
    getWigets();
  }, [selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <Box>
      <Image
        src={image}
        position={"absolute"}
        zIndex={-10}
        h={"100vh"}
        w={"100%"}
      ></Image>

      <Navbar openModal={openModal} onDateChange={handleDateChange} />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={25} fontWeight={"bold"}>
            Créer une Invitation
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection={"column"} alignItems={"center"}>
              <Box
                w={"80%"}
                h={1}
                bg={"#0E487D"}
                mt={"-10px"}
                mb={"20px"}
                borderRadius={"full"}
              />
              <Text alignSelf={"baseline"} fontSize={20} fontWeight={"bold"}>
                Insérer addresse mail{" "}
              </Text>
              <Input
                mt={5}
                mb={5}
                placeholder="Addresse mail"
                onChange={(e) => setEmail(e.target.value)}
              ></Input>
              <Button alignSelf={"end"} mt={"20px"} onClick={sendInvit}>
                Inviter
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Flex display="flex" justify="space-evenly" flexWrap="wrap">
        {loadingWidgets ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : widgets.length > 0 ? (
          widgets.map((widget: any, index: number) => (
            <Box
              key={index}
              bg={"#FFFFFFA0"}
              borderRadius={20}
              p={4}
              width={widget.size === "SMALL" ? "15%" : "40%"}
              h="200px"
              margin="50px"
              flexDirection="row"
              justifyContent="space-evenly"
              display="flex"
              alignItems="center"
            >
              <Box style={{ display: "flex", flexDirection: "row" }}>
                <Box style={{ marginLeft: "10px" }}>
                  <Text style={{ fontSize: "20px" }}>{widget.displayName}</Text>
                  <Flex flexDirection="row" alignItems={"center"}>
                    <Image
                      src={
                        widget.isSunny
                          ? sunny
                          : widget.isCloudy
                          ? cloudy
                          : widget.isRainy
                          ? rain
                          : storm
                      }
                      alt="weather"
                      width={widget.size === "SMALL" ? "50px" : "100px"}
                      style={{ marginRight: "10px" }}
                    />
                    <Text style={{ fontSize: "35px", fontWeight: "bold" }}>
                      {!widget.temperature ? <Spinner /> : widget.temperature}°C
                    </Text>
                  </Flex>
                </Box>
              </Box>
              {widget.size !== "SMALL" && (
                <Box
                  style={{
                    fontSize: "20px",
                    textAlign: "left",
                    lineHeight: "40px",
                  }}
                >
                  <Text>
                    Humidité :{" "}
                    {!widget.humidity ? <Spinner /> : widget.humidity}%
                  </Text>
                  <Text>
                    Vent : {!widget.wind ? <Spinner /> : widget.wind}km/h
                  </Text>
                </Box>
              )}
            </Box>
          ))
        ) : (
          <Text>Vous n'avez pas encore de widgets.</Text>
        )}

        <Box
          bg={"#FFFFFFA0"}
          borderRadius={20}
          p={4}
          width="15%"
          h="200px"
          textAlign="center"
          display="flex"
          margin="50px"
          flexDirection="column"
          justifyContent="space-evenly"
        >
          <Box style={{ marginLeft: "10px" }}>
            <Text>Créer un Widget</Text>
            {loadingCreateWidgets ? (
              <Spinner />
            ) : (
              <form onSubmit={createWidget}>
                <Box>
                  <label htmlFor="taille">Taille :</label>
                  <select
                    name="taille"
                    id="taille"
                    value={taille}
                    onChange={(e) => setTaille(e.target.value)}
                  >
                    <option value="SMALL">Petit</option>
                    <option value="MEDIUM">Grand</option>
                  </select>
                </Box>

                <Box>
                  <label htmlFor="ville">Ville :</label>
                  <input
                    type="text"
                    name="ville"
                    id="ville"
                    placeholder="Nom de la ville"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                  />
                </Box>

                <Box>
                  <Button 
                    bg={"none"} 
                    type="submit"
                    _hover={{ bg: "none" }}
                    >
                    Créer Widget
                  </Button>
                </Box>
              </form>
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

export default HomePage;
