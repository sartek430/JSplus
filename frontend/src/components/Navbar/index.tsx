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
import { User } from "../../models/user.ts";
import { Invit } from "../../models/invit.ts";
import { useNavigate } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";
import ContactModal from "./ContactModal/index.tsx";

/**
 * Propriétés attendues par le composant Navbar.
 *
 * @typedef {Object} NavbarProps
 * @property {Function} onDateChange - Fonction appelée lorsqu'une date est sélectionnée.
 */
interface NavbarProps {
  onDateChange: (date: Date) => void;
  dashboardName?: string;
}

/**
 * Composant Navbar affichant la barre de navigation.
 *
 * @param {NavbarProps} props - Propriétés du composant Navbar.
 */
const Navbar: React.FC<NavbarProps> = ({ onDateChange, dashboardName }: NavbarProps) => {
  const currentDate = new Date();
  const maxDate = new Date(currentDate);
  maxDate.setDate(currentDate.getDate() + 6);
  const toast = useToast();
  const [Invits, setInvits] = useState<Invit[]>([]);
  const { isOpen: isInvitModalOpen, onOpen: onInvitModalOpen, onClose: onInvitModalClose } = useDisclosure();
  const { isOpen: isNotifModalOpen, onOpen: onNotifModalOpen, onClose: onNotifModalClose } = useDisclosure();
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { isOpen: isContactModalOpen, onOpen: onContactModalOpen, onClose: onContactModalClose } = useDisclosure();

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Gère le changement de date.
   *
   * @param {Date | null} date - La date sélectionnée.
   */
  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    onDateChange(date);
  };

  /**
   * Ouvre la modal d'invitation.
   */
  const openInvitModal = (): void => {
    onInvitModalOpen();
  };

  /**
   * Ouvre la modal de notifications.
   */
  const openNotifModal = (): void => {
    onNotifModalOpen();
  };

  /**
   * Ferme la modal en cours.
   */
  const closeModal = () => {
    if (isInvitModalOpen) {
      onInvitModalClose();
    } else if (isNotifModalOpen) {
      onNotifModalClose();
    } else if (isContactModalOpen) {
      onContactModalClose();
    }
  };

  /**
   * Envoie une invitation à l'adresse e-mail spécifiée.
   */
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
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then(() => {
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

  /**
   * Récupère la liste des utilisateurs depuis le serveur.
   */
  const getUsers = async () => {
    try {
      const response = await axios.get("https://meteoplus.fly.dev/users/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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

  /**
   * Récupère la liste des invitations depuis le serveur.
   */
  const getInvit = async () => {
    try {
      const response = await axios.get("https://meteoplus.fly.dev/invits", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setInvits(response.data);
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

  /**
   * Accepte une invitation spécifiée par son identifiant.
   *
   * @param {number} id - Identifiant de l'invitation à accepter.
   */
  const acceptInvit = async (id: number) => {
    try {
      await axios.patch(
        `https://meteoplus.fly.dev/invits/${id}`,
        {
          status: 200,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      getInvit(); // Supposant que c'est une fonction à appeler pour rafraîchir les données
      toast({
        title: "Invitation acceptée",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error("Erreur lors de l'acceptation de l'invitation", error);
      toast({
        title: "Erreur lors de l'acceptation de l'invitation",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /**
   * Refuse une invitation spécifiée par son identifiant.
   *
   * @param {number} id - Identifiant de l'invitation à refuser.
   */
  const refuseInvit = async (id: number) => {
    try {
      const response = await axios.patch(
        `https://meteoplus.fly.dev/invits/${id}`,
        {
          status: 300,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      console.log("Invitation refusée :", response.data);
      getInvit();
      toast({
        title: "Invitation refusée",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error("Erreur lors du refus de l'invitation", error);
      toast({
        title: "Erreur lors du refus de l'invitation",
        description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex as="nav" align="center" gap={10} padding="1.5rem" backgroundColor="#FFFFFF" justifyContent={"space-between"}>
      <Flex justify="space-between">
        <Text color="#0E487D" fontWeight={"bold"} fontSize={35}>
          {dashboardName ? `Tableau de bord de ${dashboardName}` : "Tableau de bord"}
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
          min={currentDate.toISOString().slice(0, 16)}
          max={maxDate.toISOString().slice(0, 16)}
          defaultValue={currentDate.toISOString().slice(0, 16)}
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
              Notification(s)
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex flexDirection={"column"} alignItems={"center"}>
                <Box w={"80%"} h={1} bg={"#0E487D"} mt={"-10px"} mb={"20px"} borderRadius={"full"} />
                <Text alignSelf={"baseline"} fontSize={20} fontWeight={"bold"}>
                  Invitations
                </Text>
                {Invits.length > 0 ? (
                  Invits.map((notif) => (
                    <React.StrictMode key={notif.id}>
                      <Text mt={5} mb={30} fontWeight={500}>
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
                    Aucune invitation
                  </Text>
                )}
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/MeteoPlus/login");
          }}
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
          Se deconnecter
        </Button>

        <Box _hover={{ cursor: "pointer" }} onClick={onContactModalOpen} mr={10} mt={Invits.length > 0 ? -5 : 0}>
          <FaUserFriends size={30} color={"#000000"} />
        </Box>

        <Box _hover={{ cursor: "pointer" }} onClick={openNotifModal} mr={10} mt={Invits.length > 0 ? -5 : 0}>
          {Invits.length > 0 && (
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
              <Text fontSize={15}>{Invits.length}</Text>
            </Flex>
          )}

          <FaRegBell size={30} color={"#000000"} />
        </Box>
      </Flex>

      <ContactModal isContactModalOpen={isContactModalOpen} closeModal={onContactModalClose} users={users} />
    </Flex>
  );
};

export default Navbar;
