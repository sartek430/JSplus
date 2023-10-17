import {
  Box,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Button, Flex, Link, Avatar, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Modal, Divider    } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';




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
            Accueil
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
        <Box
          bg={"#e0e0e0"}         
          boxShadow={"-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"}
          borderRadius={20}
          p={4}
          width="40%"
          h="200px"
          textAlign="center"
          display="flex"
          margin="50px"
          flexDirection="row"
          justifyContent="space-evenly"
        >
          <div>
            <p>Température : 20°C</p>
          </div>
          <div>
            <DatePicker
                selected={selectedDate}
                onChange={(date) => handleDateChange(date)}
                isClearable
                showYearDropdown
                showMonthDropdown
                dateFormat="dd/MM/yyyy"
              />
            <p>Ville : Paris</p>
            <p>Humidité : Ensoleillé</p>
          </div>
        </Box>

        <Box
          bg={"#e0e0e0"}         
          boxShadow={"-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"}
          borderRadius={20}
          p={4}
          width="40%"
          h="200px"
          textAlign="center"
          display="flex"
          margin="50px"
          flexDirection="row"
          justifyContent="space-evenly"
        >
          <div>
            <p>Température : 20°C</p>
          </div>
          <div>
            <DatePicker
                selected={selectedDate}
                onChange={(date) => handleDateChange(date)}
                isClearable
                showYearDropdown
                showMonthDropdown
                dateFormat="dd/MM/yyyy"
              />
            <p>Ville : Paris</p>
            <p>Humidité : Ensoleillé</p>
          </div>
        </Box>


        <Box
          bg={"#e0e0e0"}         
          boxShadow={"-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"}
          borderRadius={20}
          p={4}
          width="40%"
          h="200px"
          textAlign="center"
          display="flex"
          margin="50px"
          flexDirection="row"
          justifyContent="space-evenly"
        >
          <div>
            <p>Température : 20°C</p>
          </div>
          <div>
            <DatePicker
                selected={selectedDate}
                onChange={(date) => handleDateChange(date)}
                isClearable
                showYearDropdown
                showMonthDropdown
                dateFormat="dd/MM/yyyy"
              />
            <p>Ville : Paris</p>
            <p>Humidité : Ensoleillé</p>
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
          <div>
            <DatePicker
                selected={selectedDate}
                onChange={(date) => handleDateChange(date)}
                isClearable
                showYearDropdown
                showMonthDropdown
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <p>Température : 20°C</p>
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
          <div>
            <DatePicker
                selected={selectedDate}
                onChange={(date) => handleDateChange(date)}
                isClearable
                showYearDropdown
                showMonthDropdown
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <p>Température : 20°C</p>
        </Box>

      </Flex>
      

      

    </div>
    

    


  );
}

export default HomePage;
