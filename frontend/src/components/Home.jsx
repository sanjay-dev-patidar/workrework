import React,  { useState, useEffect, useRef } from "react";
import { Box, Input, VStack, Text, Image, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Welcome from "./Welcome";
import ReactPlayer from "react-player";

import CompilerOverlay from "./CompilerOverlay";
import { useNavigate, useLocation } from "react-router-dom"; // Import the necessary hooks
import "./Home.css";

const Home = ({ selectedDocument }) => {
  const [allFields, setAllFields] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [playingVideoUrl, setPlayingVideoUrl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [compilerVisible, setCompilerVisible] = useState(false);

  const observer = useRef();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setAllFields(
      selectedDocument
        ? Object.entries(selectedDocument).filter(([field]) => field !== "_id")
        : []
    );

    if (selectedDocument) {
      setShowWelcome(false);
    }
  }, [selectedDocument]);
  
useEffect(() => {
    fetch('https://educare-1.onrender.com//api/getData')
      .then(response => response.json())
      .then(data => {
        setAllFields(data); // Assuming the data structure matches what you need
        setShowWelcome(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const fieldIndex = urlParams.get("selectedField");
    if (fieldIndex !== null) {
      setSelectedField(parseInt(fieldIndex));
      const fieldElement = document.getElementById(`field-${fieldIndex}`);
      if (fieldElement) {
        const container = document.getElementById("home-section");
        const containerRect = container.getBoundingClientRect();
        const fieldRect = fieldElement.getBoundingClientRect();

        const offsetY = fieldRect.top - containerRect.top;
        container.scrollBy({ top: offsetY, behavior: "smooth" });
      }
      setSidebarOpen(false);
    }
  }, [location.search]);

  const observeLastField = (node) => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Load more fields if needed
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  };

  const handleScroll = () => {
    const container = document.getElementById("home-section");
    if (container) {
      const scrollPosition = container.scrollTop;
      const containerHeight = container.scrollHeight - container.clientHeight;
      const progress = (scrollPosition / containerHeight) * 100;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    const container = document.getElementById("home-section");
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const handleTitleClick = (videoUrl) => {
    setPlayingVideoUrl(videoUrl);
  };

  const handleFieldClick = (fieldIndex) => {
    const fieldElement = document.getElementById(`field-${fieldIndex}`);
    if (fieldElement) {
      const container = document.getElementById("home-section");
      const containerRect = container.getBoundingClientRect();
      const fieldRect = fieldElement.getBoundingClientRect();

      const offsetY = fieldRect.top - containerRect.top;
      container.scrollBy({ top: offsetY, behavior: "smooth" });
    }
    setSelectedField(fieldIndex);
    setSidebarOpen(false); // Close sidebar after navigation
    navigate(`/home?selectedField=${fieldIndex}`);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const filteredFields = () => {
    return allFields.filter(([field, value]) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const toggleCompiler = () => {
    setCompilerVisible(!compilerVisible);
  };

  const renderNestedData = (data) => {
 return (
      <VStack align="start" spacing={1} pl={4}>
        {Object.entries(data).map(([nestedField, nestedValue], nestedIndex) => (
          <Box key={nestedIndex} w="100%">
            <Text fontWeight="bold">{nestedField}:</Text>
            {typeof nestedValue === "string" && nestedValue.startsWith("http") ? (
              nestedValue.match(/\.(jpeg|jpg|gif|png)$/) ? (
                <Image src={nestedValue} alt="Image" className="data-image" />
              ) : nestedValue.match(/\.(mp4|webm|mkv)$/) ? (
                <Box
                  position="relative"
                  paddingTop="56.25%"
                >
                  <ReactPlayer
                    url={nestedValue}
                    controls
                    width="100%"
                    height="100%"
                    style={{ position: "absolute", top: 0, left: 0 }}
                  />
                </Box>
              ) : (
                <Text>{nestedValue}</Text>
              )
            ) : Array.isArray(nestedValue) ? (
              renderNestedArray(nestedValue)
            ) : typeof nestedValue === "object" ? (
              renderNestedData(nestedValue)
            ) : (
              <Text>{nestedValue}</Text>
            )}
          </Box>
        ))}
      </VStack>
    );
  };
  
  const renderNestedArray = (array) => {
    return (
      <VStack align="start" spacing={1} pl={4}>
        {array.map((item, idx) => (
          <Box key={idx} w="100%">
            {typeof item === "string" && item.startsWith("http") ? (
              item.match(/\.(jpeg|jpg|gif|png)$/) ? (
                <Image src={item} alt={`Image ${idx}`} className="data-image" />
              ) : item.match(/\.(mp4|webm|mkv)$/) ? (
                <Box
                  position="relative"
                  paddingTop="56.25%"
                >
                  <ReactPlayer
                    url={item}
                    controls
                    width="100%"
                    height="100%"
                    style={{ position: "absolute", top: 0, left: 0 }}
                  />
                </Box>
              ) : (
                <Text>{item}</Text>
              )
            ) : Array.isArray(item) ? (
              renderNestedArray(item)
            ) : typeof item === "object" ? (
              renderNestedData(item)
            ) : (
              <Text>{item}</Text>
            )}
          </Box>
        ))}
      </VStack>
    );
  };
  
  return (
    <Box
      w="full"
      minH="100vh"
      mx="auto"
      d="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="flex-start"
      id="home-section"
      overflowY="scroll"
      maxHeight="calc(100vh - 100px)"
      height="auto"
      overflowX="hidden"
      border="1px solid #ccc"
      boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
    >
      {showWelcome && <Welcome hideWelcome={!showWelcome} />}
      {!showWelcome && (
        <Box
          className={`sticky top-0 z-10 p-4 ${
            sidebarOpen ? "show-sidebar" : ""
          }`}
          boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
          borderBottom="none"
          bg="white"
        >
          <Input
            type="text"
            placeholder="Search for fields"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            w="full"
            p={2}
            borderWidth="1px"
            rounded="md"
            bg="gray.100"
          />
          <VStack mt={2} spacing={2} align="stretch">
            <Box w={`${scrollProgress}%`} h="4px" bg="green" rounded="sm" />
          </VStack>
          <Button
            className="sidebar-toggle"
            onClick={handleSidebarToggle}
          >
            ExpandVue
          </Button>
          <Button
            onClick={toggleCompiler}
            variant="link"
            className="compiler-button"
          >
            Compiler
          </Button>
          {/* Compiler overlay */}
          {compilerVisible && <CompilerOverlay onClose={toggleCompiler} />}
          <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <Text className="section-heading">Data Dive Point</Text>
            {allFields.map(([field], index) => (
              <div
                key={index}
                className={`sidebar-field ${
                  selectedField === field ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedField(field);
                  handleFieldClick(index);
                }}
              >
                {field}
              </div>
            ))}
            <Button
              className="close-sidebar"
              onClick={() => setSidebarOpen(false)}
            >
              FoldSecurely
            </Button>
          </div>
        </Box>
      )}
      <Box maxW="7xl" mx="auto" p={4} mt={8} style={{ marginTop: "48px" }}>
      {filteredFields().map(([field, value], index) => (
        <motion.div
          key={index}
          id={`field-${index}`}
          ref={
            index === filteredFields().length - 1
              ? (node) => observeLastField(node)
              : null
          }
        >
          <Box w="100%">
            <Text
              onClick={() => {
                setSelectedField(field);
                handleFieldClick(index);
              }}
              cursor="pointer"
              color={selectedField === field ? "blue" : "red "}
              fontWeight="bold"
              fontSize="lg"
            >
              {field}:
            </Text>
            {Array.isArray(value) ? (
              renderNestedArray(value)
            ) : typeof value === "object" ? (
              renderNestedData(value)
            ) : (
              <Text>{value}</Text>
            )}
          </Box>
        </motion.div>
      ))}
    </Box>
  </Box>
);
};

export default Home;
