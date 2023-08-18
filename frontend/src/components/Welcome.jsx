import React,  { useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import Typed from "react-typed";
import { FaRocket } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { motion } from "framer-motion";

const Welcome = ({ hideWelcome }) => {
  const [showTypedText, setShowTypedText] = useState(false);
  const { selectedField } = useParams();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowTypedText(true);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  if (selectedField) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ display: hideWelcome ? "none" : "block" }}
      >
        <Box p={4} bg="white" color="black" boxShadow="md" rounded="md">
          <Text fontSize="xl" fontWeight="bold" color="#FFB300">
          Displaying Content for Field: {selectedField}
        </Text>
        <VStack spacing={4} align="start">
          {fieldData.map((item, index) => (
            <Text key={index}>{item}</Text>
          ))}
        </VStack>
        </Box>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ display: hideWelcome ? "none" : "block" }}
    >
      <VerticalTimeline layout="1-column">
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          iconStyle={{ background: "#2C2906", color: "#fff" }}
          contentStyle={{ background: "#1A1911", color: "#fff" }}
        >
          <Text fontSize="xl" fontWeight="bold" color="#FFB300">
            {showTypedText && (
              <Typed
                strings={[
                  "Welcome to a World of Imagination!",
                  "Embark on a Journey of Creativity!",
                  "Where Ideas Transform into Reality!",
                ]}
                typeSpeed={50}
                backSpeed={30}
                backDelay={1500}
                loop
              />
            )}
          </Text>
          <Text mt={2} color="#FFB300">
            <FaRocket style={{ marginRight: "0.5rem" }} />
            Immerse yourself in the fusion of imagination and cutting-edge technology. Navigate, explore, and innovate!
          </Text>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          iconStyle={{ background: "#2C2906", color: "#fff" }}
          contentStyle={{ background: "#1A1911", color: "#fff" }}
        >
          <Text fontSize="lg" fontWeight="bold" color="#FFB300">
            Enhancements:
           </Text>
         
          <Text color="#FFB300">
            Endless Exploration: Unfold Insights Seamlessly - Swipe Through Infinite Data!
          </Text>
          <Text color="#FFB300">
            Search Magic: Unleash the Power of Search - Discover Fields Easily!
          </Text>
          <Text color="#FFB300">
            ExpandVue: Unlock a World of Possibilities – Effortlessly Reveal Deeper Insights!
          </Text>
          <Text color="#FFB300">
            Magnify Search: Enter Keywords to Spotlight Fields!
          </Text>
          <Text color="#FFB300">
            Words Unleashed: Words Have No Limits!
          </Text>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          iconStyle={{ background: "#2C2906", color: "#fff" }}
          contentStyle={{ background: "#1A1911", color: "#fff" }} // Creative AI-inspired background color
        >
          <Text fontSize="xl" fontWeight="bold" color="#FFB300">
            Spark Your Imagination!
          </Text>
          <Text mt={2} color="#FFB300">
            <FaRocket style={{ marginRight: "0.5rem" }} />
            Uncover the hidden stories within the data. Navigate effortlessly and explore every insight using futuristic interfaces.
          </Text>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </motion.div>
  );
};

export default Welcome;

