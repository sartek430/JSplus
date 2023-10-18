import {
  Box,
  Text,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Button, Flex, Link, Avatar, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Modal, Divider    } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';



function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Mois commence à 0, donc ajoutez 1
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:00`;
}


function HomePage() {



  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date: Date | null) => {
    if(!date) return
    setSelectedDate(date);
  };


  const [widgets, setWidgets] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(true);


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);

  const getWigets = async() => {
    const response = await fetch("https://meteoplus.fly.dev/widgets", { 
      method: "GET",
      headers: {"Authorization":"Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqdWxlc0BqdWxlcy5qdSIsIm5hbWUiOiJKdWxlcyIsImlhdCI6MTY5NzQ4NDA1MCwiZXhwIjoxNzI5MDIwMDUwfQ.pxFcgg7dHgp_6tsJ-gQfTrU5916147EcAXOMAqYpQOoo8gQ9Z07K-9VcrxxWvN8XJfbRT-leeR6wnkK3ZBpGChiYuRxfdGT3M8BVblgNNKJpFPj6PKPkjdbKuSFVXNtQWhnZBTjQPX_wLfGNW1h8KqN7Iyi3yx27yWrgQk6YzJvbhCi9w4gyJswIFIOGk8GLiOabfR_1UUkH6MTshfh-1CckExYBCDn92GXPSmncZH2g_gYSoxBKOByjjZpHs3245XBqpHhWtlm4cgm3ZyhX6accqg0IOipIkj25ZagjeSI3E2dld4YD7OLvNlc9czvEnSuv7gR_7ekom-yywc77SQ",
      "ngrok-skip-browser-warning":"*",
      'Access-Control-Allow-Origin': '*'}
    })
    console.log(await response.json())
  }

  const getWeather = async() => {
    const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=50.6495&longitude=3.113&hourly=temperature_2m,relativehumidity_2m,precipitation,windspeed_10m&timezone=Europe%2FLondon", { 
      method: "GET",
    })

    setWeatherData(await response.json())
  }


  const currentDateTime = getCurrentDateTime();

  


  useEffect(() => {
    getWigets()
    getWeather()
    console.log(currentDateTime);
  }, []);


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
        <Flex justify="space-between" width="7%">
          <Link href="/about" color="white" textDecoration="none" >
            Tableau de bord
          </Link>
          <Link href="/contact" color="white" textDecoration="none">
            Autre
          </Link>
        </Flex>
        <Flex justify="space-between" width="4.5%">
          <Link onClick={openModal} color="white" textDecoration="none">
            <EmailIcon boxSize={7}  />
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

        {weatherData == null?"chargement":JSON.stringify(weatherData.hourly.time.indexOf(currentDateTime))
        
        }

        <Box
          bg="#e0e0e0"
          boxShadow="-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"
          borderRadius={20}
          p={4}
          width="40%"
          h="200px"
          margin="50px"
          flexDirection="row"
          justifyContent="space-evenly"
          display="flex"
          alignItems="center"
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ marginLeft: "10px" }}>
              <p style={{ fontSize: "20px"}}>Lille</p>
              <p style={{ fontSize: "35px", fontWeight: "bold" }}>{weatherData == null?"chargement":JSON.stringify(weatherData.hourly.temperature_2m[0])}</p>
              <p>min : 12°C</p>
              <p>max : 25°C</p>
            </div>
          </div>
          <div style={{ fontSize: "20px", textAlign: "left", lineHeight: "40px"}}>
            <DatePicker
                selected={selectedDate}
                onChange={(date) => handleDateChange(date)}
                isClearable
                showYearDropdown
                showMonthDropdown
                dateFormat="dd/MM/yyyy"
              />
            <p>Humidité : 25%</p>
            <p>Vent : Calme</p>
            <p>Pression : 1013 hPa</p>
          </div>
        </Box>



        <Box
          bg="#e0e0e0"
          boxShadow="-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"
          borderRadius={20}
          p={4}
          width="40%"
          h="200px"
          margin="50px"
          flexDirection="row"
          justifyContent="space-evenly"
          display="flex"
          alignItems="center"
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ marginLeft: "10px" }}>
              <p style={{ fontSize: "20px"}}>Lille</p>
              <p style={{ fontSize: "35px", fontWeight: "bold" }}>20°C</p>
              <p>min : 12°C</p>
              <p>max : 25°C</p>
            </div>
          </div>
          <div style={{ fontSize: "20px", textAlign: "left", lineHeight: "40px"}}>
            <DatePicker
                selected={selectedDate}
                onChange={(date) => handleDateChange(date)}
                isClearable
                showYearDropdown
                showMonthDropdown
                dateFormat="dd/MM/yyyy"
              />
            <p>Humidité : 25%</p>
            <p>Vent : Calme</p>
            <p>Pression : 1013 hPa</p>
          </div>
        </Box>


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
            <DatePicker
                selected={selectedDate}
                onChange={(date) => handleDateChange(date)}
                isClearable
                showYearDropdown
                showMonthDropdown
                dateFormat="dd/MM/yyyy"
              />
            <div style={{ marginLeft: "10px" }}>
              <p style={{ fontSize: "20px"}}>Lille</p>
              <p style={{ fontSize: "35px", fontWeight: "bold" }}>20°C</p>
              <p>min : 12°C</p>
              <p>max : 25°C</p>
            </div>
        </Box>

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
            <DatePicker
                selected={selectedDate}
                onChange={(date) => handleDateChange(date)}
                isClearable
                showYearDropdown
                showMonthDropdown
                dateFormat="dd/MM/yyyy"
              />
            <div style={{ marginLeft: "10px" }}>
              <p style={{ fontSize: "20px"}}>Lille</p>
              <p style={{ fontSize: "35px", fontWeight: "bold" }}>20°C</p>
              <p>min : 12°C</p>
              <p>max : 25°C</p>
            </div>
        </Box>

        

      </Flex>
      

      

    </div>
    

    


  );
}

export default HomePage;
