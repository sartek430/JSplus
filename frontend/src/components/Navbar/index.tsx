import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";

interface NavbarProps {
  onDateChange: (date: Date) => void;
}

interface Notification {
  id: number;
  senderId: string;
  receiverId: string;
  status: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const Navbar: React.FC<NavbarProps> = ({ onDateChange }) => {
  const currentDate = new Date();
  const maxDate = new Date(currentDate);
  maxDate.setDate(currentDate.getDate() + 6);
  const toast = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { isOpen: isInvitModalOpen, onOpen: onInvitModalOpen, onClose: onInvitModalClose } = useDisclosure();

  const { isOpen: isNotifModalOpen, onOpen: onNotifModalOpen, onClose: onNotifModalClose } = useDisclosure();
  const [users, setUsers] = useState<User[]>([]);

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    onDateChange(date);
  };

  useEffect(() => {
    getInvits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        },
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

  const openInvitModal = (): void => {
    onInvitModalOpen();
  };

  const openNotifModal = (): void => {
    getUsers();
    onNotifModalOpen();
  };

  const closeModal = () => {
    onInvitModalClose();
    onNotifModalClose();
  };

  const getUsers = async () => {
    try {
      const response = await axios.get("https://meteoplus.fly.dev/users/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Expéditeur(s) récupéré(s) :", response.data);
      setUsers(response.data);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des expéditeurs", error);
      toast({
        title: "Erreur lors de la récupération de(s) expéditeur(s)",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getInvits = async () => {
    try {
      const response = await axios.get("https://meteoplus.fly.dev/invits", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Invitation récupéré :", response.data);
      setNotifications(response.data);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des invitations", error);
      toast({
        title: "Erreur lors de la récupération des invitations",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const acceptInvit = async (id: number) => {};

  const refuseInvit = async (id: number) => {};

  return (
    <Flex as="nav" align="center" gap={10} padding="1.5rem" backgroundColor="#FFFFFF" justifyContent={"space-between"}>
      <Flex justify="space-between">
        <Text color="#0E487D" fontWeight={"bold"} fontSize={35}>
          Tableau de bord
        </Text>
      </Flex>
      <Flex>
        <Input
          onChange={(e) => handleDateChange(new Date(e.target.value))}
          border={"2px"}
          borderColor={"#000000"}
          _hover={{ borderColor: "#0E487D", cursor: "pointer" }}
          placeholder="Select Date and Time"
          size="md"
          type="datetime-local"
        />
      </Flex>

      <Flex alignItems={"center"}>
        <Button
          onClick={openInvitModal}
          fontSize={20}
          bg={"none"}
          _hover={{
            bg: "none",
            transform: "scale(1.05)",
          }}
          _active={{ transform: "scale(0.9)" }}
          color={"#000000"}
          mr={5}
        >
          Inviter
        </Button>

        <Modal isOpen={isInvitModalOpen} onClose={onInvitModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize={25} fontWeight={"bold"}>
              Créer une Invitation
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex flexDirection={"column"} alignItems={"center"}>
                <Box w={"80%"} h={1} bg={"#0E487D"} mt={"-10px"} mb={"20px"} borderRadius={"full"} />
                <Text alignSelf={"baseline"} fontSize={20} fontWeight={"bold"}>
                  Insérer addresse mail{" "}
                </Text>
                <Input mt={5} mb={5} placeholder="Addresse mail" onChange={(e) => setEmail(e.target.value)}></Input>
                <Button alignSelf={"end"} mt={"20px"} onClick={sendInvit}>
                  Inviter
                </Button>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal isOpen={isNotifModalOpen} onClose={onNotifModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize={25} fontWeight={"bold"}>
              Notifications
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex flexDirection={"column"} alignItems={"center"}>
                <Box w={"80%"} h={1} bg={"#0E487D"} mt={"-10px"} mb={"20px"} borderRadius={"full"} />
                <Text alignSelf={"baseline"} fontSize={20} fontWeight={"bold"}>
                  Invitations
                </Text>
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <React.StrictMode>
                      <Text key={notif.id} mt={5} mb={30} fontWeight={500}>
                        {users.find((user) => user.id === notif.senderId)?.name ?? "inconnu"} vous a invité
                      </Text>
                      <Flex justifyContent={"space-around"}>
                        <Button m={4} onClick={() => refuseInvit(notif.id)}>
                          Refuser
                        </Button>

                        <Button
                          m={4}
                          alignSelf={"end"}
                          onClick={() => acceptInvit(notif.id)}
                          color={"#FFFFFF"}
                          bg={"#0E487D"}
                          _hover={{
                            bg: "#0E487D",
                            transform: "scale(1.05)",
                          }}
                          _active={{ transform: "scale(0.9)" }}
                        >
                          Accepter
                        </Button>
                      </Flex>
                    </React.StrictMode>
                  ))
                ) : (
                  <Text mt={30} mb={30}>
                    Aucune notification
                  </Text>
                )}
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Box _hover={{ cursor: "pointer" }} onClick={openNotifModal} mr={10} mt={-5}>
          {notifications.length > 0 && (
            <Flex
              position={"relative"}
              w={5}
              h={5}
              bg={"red.500"}
              borderRadius={"full"}
              justifyContent={"center"}
              alignItems={"center"}
              left={"90%"}
              top={"10px"}
            >
              <Text fontSize={15}>{notifications.length}</Text>
            </Flex>
          )}

          <FaRegBell size={30} color={"#000000"} />
        </Box>
      </Flex>
    </Flex>
  );
};

export default Navbar;
