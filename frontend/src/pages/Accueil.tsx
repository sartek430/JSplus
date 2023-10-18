import { EmailIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Divider,
  Flex, Link,
  Modal,
  ModalBody, ModalCloseButton,
  ModalContent, ModalHeader,
  ModalOverlay,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';



function HomePage() {
  const [widgets, setWidgets] = useState<any[]>([]);
  const [loadingWidgets, setLoadingWidgets] = useState(true);
  const [loadingCreateWidgets, setLoadingCreateWidgets] = useState(false);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [taille, setTaille] = useState('SMALL');
  const [ville, setVille] = useState('');

  const toast = useToast()

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return
    setSelectedDate(date);
  };

  const currentDate = new Date();
  const maxDate = new Date(currentDate);
  maxDate.setDate(currentDate.getDate() + 6);

  const getWigets = async () => {
    const token = localStorage.getItem('token')
    const response = await fetch("https://meteoplus.fly.dev/widgets", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "ngrok-skip-browser-warning": "*",
        'Access-Control-Allow-Origin': '*'
      }
    })

    const widgets: any[] = await response.json()

    setWidgets(widgets)

    setLoadingWidgets(false)

    setWidgets(await Promise.all(widgets.map(async (widget: { id: number, displayName: string, latitude: string, longitude: string }) => {
      const weather = await getWeather(widget.latitude, widget.longitude)

      const year = selectedDate.getFullYear()
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0')
      const day = selectedDate.getDate().toString().padStart(2, '0')
      const hours = selectedDate.getHours().toString().padStart(2, '0')

      const date = `${year}-${month}-${day}T${hours}:00`

      return {
        ...widget,
        temperature: weather.hourly.temperature_2m[weather.hourly.time.indexOf(date) + 1],
        humidity: weather.hourly.relativehumidity_2m[weather.hourly.time.indexOf(date) + 1],
        wind: weather.hourly.windspeed_10m[weather.hourly.time.indexOf(date) + 1]
      }
    })));
  }

  const getWeather = async (lat: string, long: string) => {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,precipitation,windspeed_10m&timezone=Europe%2FLondon`, {
      method: "GET",
    })

    return await response.json()
  }


  const getCity = async () => {
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${ville}&count=1&language=fr&format=json`)
      const data = await response.json()

      return data.results?.[0]
    } catch (e) {
      console.error(e);
      return null
    }
  }

  const createWidget = async (e: any) => {
    e.preventDefault();
    setLoadingCreateWidgets(true);

    const city = await getCity()

    if (!city) {
      setLoadingCreateWidgets(false);

      return toast({
        title: 'La ville n\'a pas été trouvé',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }

    const token = localStorage.getItem('token')

    await fetch("https://meteoplus.fly.dev/widgets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "ngrok-skip-browser-warning": "*",
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        latitude: city.latitude,
        longitude: city.longitude,
        size: taille,
        displayName: `${city.name}${!!city.country ? ` (${city.country})` : ''}`,
      })
    })

    await getWigets()

    setLoadingCreateWidgets(false);
  };


  useEffect(() => {
    getWigets()
  }, [selectedDate]);


  return (
    <div>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        padding="1rem"
        borderBottom="1px solid #e0e0e0"
        backgroundColor="teal.500"
      >
        <Flex justify="space-between" width="15%">
          <Link href="/about" color="white" textDecoration="none" >
            Tableau de bord
          </Link>
          <Link href="/contact" color="white" textDecoration="none">
            Autre
          </Link>
        </Flex>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => handleDateChange(date)}
          isClearable
          minDate={currentDate}
          maxDate={maxDate}
          showYearDropdown
          showMonthDropdown
          showTimeSelect
          dateFormat="dd/MM/yyyy-HH'h'"
        />
        <Flex justify="space-between" width="4.5%">
          <Link onClick={openModal} color="white" textDecoration="none">
            <EmailIcon boxSize={7} />
          </Link>
          <Link href="/profile" color="white" textDecoration="none">
            <Avatar bg='#CBD5E0' boxSize={7} />
          </Link>
        </Flex>
      </Flex>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Messages</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Demande d'invitation : Jules vous à inviter à rejoindre son tableau de bord !</p>
            <Divider my={3} />
            <p>Demande d'invitation : Hugo vous à inviter à rejoindre son tableau de bord !</p>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Flex
        display="flex"
        justify="space-evenly"
        flexWrap="wrap"
      >

        {loadingWidgets ? (
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        ) : widgets.length > 0 ? widgets.map((widget: any) => (
          <Box
            bg="#e0e0e0"
            boxShadow="-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"
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
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ marginLeft: "10px" }}>
                <p style={{ fontSize: "20px" }}>{widget.displayName}</p>
                <p style={{ fontSize: "35px", fontWeight: "bold" }}>{!widget.temperature ? <Spinner /> : widget.temperature}°C</p>
              </div>
            </div>
            {widget.size !== "SMALL" && (
              <div style={{ fontSize: "20px", textAlign: "left", lineHeight: "40px" }}>
                <p>Humidité : {!widget.humidity ? <Spinner /> : widget.humidity}%</p>
                <p>Vent : {!widget.wind ? <Spinner /> : widget.wind}km/h</p>
              </div>
            )}
          </Box>
        )) : <p>Vous n'avez pas encore de widgets.</p>}

        <Box
          bg={"#e0e0e0"}
          boxShadow={"-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"}
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

          <div style={{ marginLeft: "10px" }}>
            <h1>Créer un Widget</h1>
            {loadingCreateWidgets ? (
              <Spinner />
            ) : (
              <form onSubmit={createWidget}>
                <div>
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
                </div>

                <div>
                  <label htmlFor="ville">Ville :</label>
                  <input
                    type="text"
                    name="ville"
                    id="ville"
                    placeholder="Nom de la ville"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                  />
                </div>

                <div>
                  <button type="submit">Créer Widget</button>
                </div>
              </form>
            )}
          </div>
        </Box>

      </Flex>

    </div>

  );
}

export default HomePage;