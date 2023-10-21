import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createAcount();
    }
  };

  const connection = (): void => {
    axios
      .post(
        "https://meteoplus.fly.dev/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "ngrok-skip-browser-warning": "*",
          },
        }
      )
      .then((response) => {
        console.log("Utilisateur connecté :", response.data);
        toast({
          title: "Utilisateur connecté avec succès",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        localStorage.setItem("token", response.data.token);
        navigate("/accueil");
      })
      .catch((error) => {
        console.error("Erreur lors de la connection de l'utilisateur :", error);
        toast({
          title: "Erreur lors de la connection de l'utilisateur",
          description: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const createAcount = (): void => {
    if (email === "" || password === "" || username === "") {
      toast({
        title: "Erreur lors de la création de l'utilisateur",
        description: "Un des champs est vide",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    axios
      .post(
        "https://meteoplus.fly.dev/users",
        {
          email: email,
          password: password,
          name: username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "ngrok-skip-browser-warning": "*",
          },
        }
      )
      .then((response) => {
        // Gérer la réponse réussie ici
        console.log("Utilisateur créé :", response.data);
        toast({
          title: "Utilisateur créé avec succès",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        connection();
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la création de l'utilisateur :",
          error.message
        );
        toast({
          title: "Erreur lors de la création de l'utilisateur",
          description: error.response.data.message[0],
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Flex justifyContent={"space-between"}>
      <Flex
        flexDirection={"column"}
        alignItems={"center"}
        borderRadius={20}
        w={"45%"}
        h={"700px"}
        m={"auto"}
        bg={"#e0e0e0"}
        boxShadow={"-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"}
      >
        <Text
          bgClip="text"
          bgGradient={"linear(to-r, #2583DA, #0E487D)"}
          mt={"40px"}
          textAlign={"center"}
          fontSize={"35px"}
          fontWeight={700}
        >
          Bienvenue sur Météo+ !
        </Text>
        <Box
          w="45%"
          h={"3px"}
          bg={"#0E487D"}
          borderRadius={"full"}
          mt={"10px"}
        ></Box>
        <Input
          w={"50%"}
          mt={"60px"}
          variant="outline"
          placeholder="Email"
          h={"50px"}
          bg={"#FFFFFF"}
          borderColor={"#2583DA"}
          border={"2px"}
          color={"#2583DA"}
          _hover={{ borderColor: "#0E487D" }}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <Input
          w={"50%"}
          mt={"60px"}
          variant="outline"
          placeholder="Nom d'utilisateur"
          h={"50px"}
          bg={"#FFFFFF"}
          borderColor={"#2583DA"}
          border={"2px"}
          color={"#2583DA"}
          _hover={{ borderColor: "#0E487D" }}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        <InputGroup alignItems="center" justifyContent={"center"}>
          <Input
            mt={"60px"}
            mb={"40px"}
            h="50px"
            variant="outline"
            w={"50%"}
            bg={"#FFFFFF"}
            borderColor={"#2583DA"}
            _hover={{ borderColor: "#0E487D" }}
            border={"2px"}
            color={"#2583DA"}
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          {/* affiche un bouton qui affiche ou non le mot de passe */}
          <InputRightElement width="auto" m="5px">
            <Button
              onClick={() => setShowPassword(!showPassword)}
              backdropFilter={"blur(10px)"}
              mr={"170px"}
              mt={"120px"}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </Button>
          </InputRightElement>
        </InputGroup>

        <Text textAlign="center">
          <Text as="span">Tu as déjà un compte ?</Text>{" "}
          <Link to="/login">
            <Text
              as="span"
              color="brand.500"
              textDecoration={"none"}
              fontWeight={"bold"}
            >
              Connecte toi !
            </Text>
          </Link>
        </Text>

        <Button
          mt={"60px"}
          w={"50%"}
          h={"50px"}
          bgGradient={"linear(to-r, #2583DA, #0E487D)"}
          color={"#FFFFFF"}
          _hover={{
            bgGradient: "linear(to-r, #2583DA, #0E487D)",
            transform: "scale(1.05)",
          }}
          _active={{ transform: "scale(0.9)" }}
          boxShadow={"-20px 20px 60px #bebebe, 20px -20px 60px #ffffff"}
          onClick={createAcount}
        >
          Créer ton compte !
        </Button>

        <Box
          w="45%"
          h={"3px"}
          bg={"#0E487D"}
          borderRadius={"full"}
          mt={"40px"}
        ></Box>
      </Flex>
      <Image src="assets/image/Belle Nature 3560044.jpg" h={"100vh"}></Image>
    </Flex>
  );
};

export default Signup;
