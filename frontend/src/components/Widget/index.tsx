import { Box, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import { IWidget } from "../../models/widget";

interface WidgetProps {
  widget: IWidget;
  index: number;
}

const Widget: React.FC<WidgetProps> = ({ widget, index }) => {
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
                  src={`assets/image/icons/${
                    widget.isSunny
                      ? "sun"
                      : widget.isCloudy
                      ? "cloudy"
                      : widget.isRainy
                      ? "rain"
                      : "storm"
                  }.png`}
                  alt="weather"
                  width={widget.size === "SMALL" ? "50px" : "100px"}
                  style={{ marginRight: "10px" }}
                />
                <Text style={{ fontSize: "35px", fontWeight: "bold" }}>
                  {widget.temperature}°C
                </Text>
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
          <Flex>
            Humidité :{" "}
            {!widget.humidity ? (
              <Spinner />
            ) : (
              <Text ml={2}> {widget.humidity} </Text>
            )}
            %
          </Flex>
          <Flex>
            Vent :{" "}
            {!widget.wind ? <Spinner /> : <Text ml={2}> {widget.wind}</Text>}
            km/h
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default Widget;
