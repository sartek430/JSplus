import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { IWidget } from "../../models/widget";

interface WidgetProps {
  widget: IWidget;
  index: number;
  removeWidget: (index: number) => void;
}

const Widget: React.FC<WidgetProps> = ({ widget, index, removeWidget }) => {
  const { isOpen: isDeletionModalOpened, onOpen: onDeletionModalOpen, onClose: onDeletionModalClose } = useDisclosure();
  const [deletionLoading, setDeletionLoading] = useState(false);

  const toast = useToast();

  const deleteWidget = async () => {
    setDeletionLoading(true);

    const token = localStorage.getItem("token");

    const response = await fetch(`https://meteoplus.fly.dev/widgets/${widget.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "*",
        "Access-Control-Allow-Origin": "*",
      },
    });

    await response.json();

    if (response.status === 200) {
      toast({
        title: "Widget supprimé",
        description: `Le widget "${widget.displayName}" a bien été supprimé`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du widget",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    removeWidget(index);
    setDeletionLoading(false);
    onDeletionModalClose();
  };

  return (
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
      position="relative"
    >
      <Box style={{ display: "flex", flexDirection: "row" }}>
        <Box style={{ marginLeft: "10px" }}>
          <Text style={{ fontSize: "20px" }}>{widget.displayName}</Text>
          <Flex flexDirection="row" alignItems={"center"}>
            {!widget.temperature ? (
              <Spinner />
            ) : (
              <>
                <Image
                  src={`/assets/image/icons/${
                    widget.isSunny ? "sun" : widget.isCloudy ? "cloudy" : widget.isRainy ? "rain" : "storm"
                  }.png`}
                  alt="weather"
                  width={widget.size === "SMALL" ? "50px" : "100px"}
                  style={{ marginRight: "10px" }}
                />
                <Text style={{ fontSize: "35px", fontWeight: "bold" }}>{widget.temperature}°C</Text>
              </>
            )}
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
          <Flex>Humidité : {!widget.humidity ? <Spinner /> : <Text ml={2}> {widget.humidity} </Text>}%</Flex>
          <Flex>
            Vent : {!widget.wind ? <Spinner /> : <Text ml={2}> {widget.wind}</Text>}
            km/h
          </Flex>
        </Box>
      )}
      {/* display trash icon on hover */}

      <Box position={"absolute"} right={"10px"} top={"10px"} opacity={0.5}>
        <DeleteIcon
          fontSize={"20px"}
          color={"white"}
          transition={"color 0.5s"}
          cursor={"pointer"}
          _hover={{ color: "red" }}
          onClick={onDeletionModalOpen}
        />
      </Box>

      <Modal isOpen={isDeletionModalOpened} onClose={onDeletionModalClose} isCentered size={"xl"}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px) hue-rotate(10deg)" />
        <ModalContent>
          <ModalHeader fontSize={25} fontWeight={"bold"}>
            Confirmer la suppression
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection={"column"} alignItems={"center"}>
              <Flex flexDirection={"column"} alignItems={"center"} mb={5}>
                <Text fontSize={20} mb={5}>
                  Êtes-vous sûr de vouloir supprimer le widget suivant ?
                </Text>
                <Text fontSize={20} fontWeight={"bold"} mb={5}>
                  {widget.displayName}
                </Text>
              </Flex>
              <Flex flexDirection={"row"} justifyContent={"space-evenly"} width={"100%"}>
                {deletionLoading ? (
                  <Spinner />
                ) : (
                  <Button
                    colorScheme={"red"}
                    onClick={() => {
                      deleteWidget();
                    }}
                  >
                    Supprimer
                  </Button>
                )}
                <Button onClick={onDeletionModalClose}>Annuler</Button>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Widget;
