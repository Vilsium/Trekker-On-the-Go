import {
  VStack,
  Text,
  Box,
  Divider,
  HStack,
  Button,
  Link,
  Flex,
  Icon,
  useToast, //using for feedback
  List,
  ListItem,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { FaUser, FaTools, FaBell } from "react-icons/fa"; // Add icons for profile and functionality
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useNavigate,
  Link as RouterLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Notifications from "./Notification";
import NotificationBadge from "./NotificationBadge";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [availableTrekkers, setAvailableTrekkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTrekkers, setShowTrekkers] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("User_Data");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
    if (location.pathname === "/dashboard") {
      navigate("/dashboard/profile");
    }
  }, [navigate, location]);

  const handleOnTheGoClick = async () => {
    try {
      const driverToken = localStorage.getItem("token");
      console.log(driverToken);
      console.log("trekker id: " + user.LicensePlate);
      const response = await axios.post(
        "http://localhost:5000/driver/trekker-go-up",
        {
          role: "driver",
          trekkerId: user.LicensePlate,
        },
        {
          headers: { Authorization: `Bearer ${driverToken}` },
        }
      );
      if (response.data) {
        toast({
          title: "Success",
          description: "Message broadcasted: Driver is on the move.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to broadcast message.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleReachedCollegeClick = async () => {
    try {
      const driverToken = localStorage.getItem("token");
      console.log(driverToken);
      const response = await axios.post(
        "http://localhost:5000/driver/reached-college",
        {
          role: "driver",
          trekkerId: user.LicensePlate,
        },
        {
          headers: { Authorization: `Bearer ${driverToken}` },
        }
      );
      if (response.data) {
        toast({
          title: "Success",
          description: "Message broadcasted: Driver has reached the College.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to broadcast message.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleReqTrekkerClick = async () => {
    const requestTime = new Date().toISOString(); //getting real-time for request
    const passengerToken = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:5000/passenger/request-trekker",
        {
          name: user.name,
          requestTime: requestTime,
          role: "passenger",
        },
        {
          headers: { Authorization: `Bearer ${passengerToken}` },
        }
      );
      if (response) {
        toast({
          title: "Success",
          description: response.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to request trekker.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleShowAvailableTrekkersClick = async () => {
    setLoading(true);
    setShowTrekkers(false);
    try {
      const passengerToken = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/driver/available-trekkers",
        {
          role: "driver",
          trekkerId: user.LicensePlate,
        },
        {
          headers: { Authorization: `Bearer ${passengerToken}` },
        }
      );
      setAvailableTrekkers([]); //resetting for managing duplicancy of trekker id
      setAvailableTrekkers(response.data.availableTrekkers);
      setShowTrekkers(true);
    } catch (error) {
      toast({
        title: "Error!",
        description: "Failed to load available trekkers.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      justify={"center"}
      align={"center"}
      minH={"100vh"}
      bg={"gray.50"}
      p={4}
      w={"full"}
    >
      <VStack
        spacing={6}
        align="start"
        p={8}
        bg="gray.50"
        w="full"
        maxW="600px"
        borderRadius="lg"
        boxShadow="lg"
      >
        <Text fontSize="3xl" fontWeight="bold" color="teal.600" align="center">
          User Dashboard
        </Text>

        {/* Enhanced Navigation bar */}
        <HStack
          spacing={8}
          w="full"
          justifyContent="center"
          p={4}
          bg="teal.600"
          color="white"
          borderRadius="md"
          boxShadow="md"
          position="relative"
        >
          <Link
            as={RouterLink}
            to="/dashboard/profile"
            fontWeight="bold"
            _hover={{ textDecoration: "none", color: "teal.200" }}
            display="flex"
            alignItems="center"
          >
            <Icon as={FaUser} mr={2} />
            Profile
          </Link>
          <Divider orientation="vertical" borderColor="teal.400" h="24px" />
          <Link
            as={RouterLink}
            to="/dashboard/functionality"
            fontWeight="bold"
            _hover={{ textDecoration: "none", color: "teal.200" }}
            display="flex"
            alignItems="center"
          >
            <Icon as={FaTools} mr={2} />
            Functionality
          </Link>
          <Divider orientation="vertical" borderColor="teal.400" h="24px" />
          <Link
            as={RouterLink}
            to="/dashboard/notification"
            fontWeight="bold"
            _hover={{ textDecoration: "none", color: "teal.200" }}
            display="flex"
            alignItems="center"
          >
            <Icon as={FaBell} mr={2} />
            Notifications
            <NotificationBadge />
            {/* {notificationCount > 0 && (
              <Badge
                ml={1}
                colorScheme="red"
                borderRadius="full"
                px={2}
                fontSize="0.8em"
                position="absolute" // Position the badge on the top-right of the notification icon
                top="0" // Adjust the position vertically
                right="-10px" // Adjust the position horizontally
              >
                {notificationCount} // The badge displays the count of unread
                notifications
              </Badge>
            )} */}
          </Link>
        </HStack>

        <Divider borderColor="gray.300" />

        <Routes>
          <Route
            path="/profile"
            element={
              <>
                {user.name && (
                  <Box
                    w="full"
                    p={4}
                    bg="white"
                    borderRadius="md"
                    boxShadow="md"
                    borderColor="gray.200"
                    borderWidth="1px"
                  >
                    <Text fontSize="lg" fontWeight="bold">
                      Name:
                    </Text>
                    <Text>{user.name}</Text>
                  </Box>
                )}
                {user.SAP_DL_ID && (
                  <Box
                    w="full"
                    p={4}
                    bg="white"
                    borderRadius="md"
                    boxShadow="md"
                    borderColor="gray.200"
                    borderWidth="1px"
                  >
                    <Text fontSize="lg" fontWeight="bold">
                      ID:
                    </Text>
                    <Text>{user.SAP_DL_ID}</Text>
                  </Box>
                )}
                {user.Email && (
                  <Box
                    w="full"
                    p={4}
                    bg="white"
                    borderRadius="md"
                    boxShadow="md"
                    borderColor="gray.200"
                    borderWidth="1px"
                  >
                    <Text fontSize="lg" fontWeight="bold">
                      Email:
                    </Text>
                    <Text>{user.Email}</Text>
                  </Box>
                )}
                {user.phoneNo && (
                  <Box
                    w="full"
                    p={4}
                    bg="white"
                    borderRadius="md"
                    boxShadow="md"
                    borderColor="gray.200"
                    borderWidth="1px"
                  >
                    <Text fontSize="lg" fontWeight="bold">
                      Phone:
                    </Text>
                    <Text>{user.phoneNo}</Text>
                  </Box>
                )}
                {user.role && (
                  <Box
                    w="full"
                    p={4}
                    bg="white"
                    borderRadius="md"
                    boxShadow="md"
                    borderColor="gray.200"
                    borderWidth="1px"
                  >
                    <Text fontSize="lg" fontWeight="bold">
                      Role:
                    </Text>
                    <Text>{user.role}</Text>
                  </Box>
                )}

                {user.role === "Driver" && (
                  <>
                    {user.LicensePlate && (
                      <Box
                        w="full"
                        p={4}
                        bg="white"
                        borderRadius="md"
                        boxShadow="md"
                        borderColor="gray.200"
                        borderWidth="1px"
                      >
                        <Text fontSize="lg" fontWeight="bold">
                          License Plate:
                        </Text>
                        <Text>{user.LicensePlate}</Text>
                      </Box>
                    )}
                    {user.maxCapacity && (
                      <Box
                        w="full"
                        p={4}
                        bg="white"
                        borderRadius="md"
                        boxShadow="md"
                        borderColor="gray.200"
                        borderWidth="1px"
                      >
                        <Text fontSize="lg" fontWeight="bold">
                          Capacity:
                        </Text>
                        <Text>{user.maxCapacity}</Text>
                      </Box>
                    )}
                  </>
                )}
              </>
            }
          />
          <Route
            path="/functionality"
            element={
              <Box
                w="full"
                p={4}
                bg="white"
                borderRadius="md"
                boxShadow="md"
                borderColor="gray.200"
                borderWidth="1px"
              >
                <Text fontSize="lg" fontWeight="bold" mb={4}>
                  Functionality
                </Text>
                {user.role === "Passenger" && (
                  <>
                    <Button
                      colorScheme="teal"
                      variant="solid"
                      mb={2}
                      w="full"
                      onClick={handleReqTrekkerClick}
                    >
                      Request Trekker
                    </Button>
                  </>
                )}
                {user.role === "Driver" && (
                  <>
                    <Button
                      colorScheme="teal"
                      variant="solid"
                      mb={2}
                      w="full"
                      onClick={handleOnTheGoClick}
                    >
                      On the Go
                    </Button>
                  </>
                )}
                {user.role === "Passenger" && (
                  <>
                    <Button
                      colorScheme="teal"
                      variant="solid"
                      mb={2}
                      w="full"
                      onClick={handleShowAvailableTrekkersClick}
                    >
                      Show Available Trekkers
                    </Button>
                  </>
                )}

                {loading ? (
                  <Spinner size={"lg"} />
                ) : (
                  showTrekkers && (
                    <Box mt={4} w={"full"}>
                      <Text fontWeight={"bold"} mb={2}>
                        Available Trekkers
                      </Text>
                      <List spacing={2}>
                        {availableTrekkers.length > 0 ? (
                          availableTrekkers.map((trekkerId, index) => (
                            <ListItem key={index}>
                              Trekker ID: {trekkerId}
                            </ListItem>
                          ))
                        ) : (
                          <Text>No Trekkers available right now.</Text>
                        )}
                      </List>
                    </Box>
                  )
                )}

                {user.role === "Driver" && (
                  <>
                    <Button
                      colorScheme="teal"
                      variant="solid"
                      mb={2}
                      w="full"
                      onClick={handleReachedCollegeClick}
                    >
                      Reached College
                    </Button>
                  </>
                )}
              </Box>
            }
          />
          <Route path="/notification" element={<Notifications />}></Route>
        </Routes>
      </VStack>
    </Flex>
  );
};

export default Dashboard;
