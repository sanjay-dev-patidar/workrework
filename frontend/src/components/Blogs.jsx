import React, { useState, useEffect, useRef } from "react";
import "./Blogs.css";
import { Box, Input, VStack, Text, Image, IconButton } from "@chakra-ui/react";
import { FaArrowCircleUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { SectionWrapper } from "../hoc";
import { useNavigate, useLocation } from "react-router-dom";

const Blogs = () => {
  const [blogsData, setBlogsData] = useState({
    tools: [],
    working: [],
  });

  const observer = useRef();
  const isFetchingMore = useRef(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [remainingProgress, setRemainingProgress] = useState(100);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (event) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);
    navigate(`/blogs/search/${encodeURIComponent(newQuery)}`);
  };
  
  

  const fetchData = async (collection) => {
    try {
      const response = await fetch(`https://get-3dmz.onrender.com/api/${collection}`);
      const responseData = await response.json();
      setBlogsData((prevData) => ({
        ...prevData,
        [collection]: responseData.data,
      }));
    } catch (error) {
      console.error(`Error fetching ${collection} data:`, error);
    }
  };

  const observeLastBlog = (collection, node) => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // Implement your logic here if needed
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  };

  const handleScroll = (e) => {
    const container = e.target;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
  
    const contentHeight = scrollHeight - clientHeight;
    const progress = (scrollTop / contentHeight) * 100;
  
    setScrollProgress(progress);
  
    const remaining = 100 - progress;
    setRemainingProgress(remaining);
  
    navigate(`/blogs/search/${encodeURIComponent(searchQuery)}`);
  };
  
  
  const scrollToTop = () => {
    const container = document.getElementById("blogs-section");
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const query = location.pathname.split("/blogs/search/")[1] || "";
    setSearchQuery(decodeURIComponent(query));
    fetchData("tools");
    fetchData("working");
  }, [location.pathname]);
  
  const filteredBlogs = (collection) => {
    return blogsData[collection].filter((blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const headerStyle = {
    position: "sticky",
    top: -25,
    zIndex: 1,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "1rem",
    backdropFilter: "blur(10px)",
    background: "white",
  };

  const progressBarStyle = {
    width: `${scrollProgress}%`,
    height: "4px",
    backgroundColor: "green",
    borderRadius: "2px",
    transition: "width 0.3s",
  };

  const remainingBarStyle = {
    width: `${remainingProgress}%`,
    height: "4px",
    backgroundColor: "lightgray",
    borderRadius: "2px",
  };

  const scrollToTopButtonStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 2,
    background: "green",
    color: "white",
    borderRadius: "50%",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.3s",
    fontSize: "24px",
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
      id="blogs-section"
      overflowY="scroll"
      maxHeight="calc(100vh - 100px)"
      height="auto"
      overflowX="hidden"
      boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
      onScroll={handleScroll}
    >
      <Box style={headerStyle}>
        <VStack spacing={0} align="start" w="100%">
        <Input
  type="text"
  placeholder="Search for blogs"
  value={searchQuery}
  onChange={handleSearchChange}
  p={2}
  borderWidth="1px"
  rounded="md"
  bg="white"
  color="black"
  mb={2}
/>


          <Box style={progressBarStyle} />
          <Box style={remainingBarStyle} />
        </VStack>
        <IconButton
          icon={<FaArrowCircleUp />}
          aria-label="Scroll to Top"
          onClick={scrollToTop}
          style={scrollToTopButtonStyle}
        />
      </Box>
      <Box mt={8} p={4}>
        {Object.keys(blogsData).map((collection) => (
          <Box key={collection} w="full" mt={8}>
            <Text fontSize="xl" fontWeight="bold" mb={2}>{`${collection.charAt(0).toUpperCase()}${collection.slice(1)} Blog`}</Text>
            {filteredBlogs(collection).map((blog, index) => (
              <motion.div
                key={blog._id}
                ref={
                  index === filteredBlogs(collection).length - 1
                    ? (node) => observeLastBlog(collection, node)
                    : null
                }
              >
                <VStack align="start" spacing={2}>
                  <Text fontSize="lg" fontWeight="semibold">{blog.title}</Text>
                  <Text>{blog.overview}</Text>
                  <VStack spacing={2}>
                    {blog.imageURL.map((url, imgIndex) => (
                      <Image
                        key={imgIndex}
                        src={url}
                        alt={`Image ${imgIndex}`}
                        maxW="100%"
                      />
                    ))}
                  </VStack>
                  {/* Display other blog information */}
                </VStack>
              </motion.div>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SectionWrapper(Blogs, "blogs");
