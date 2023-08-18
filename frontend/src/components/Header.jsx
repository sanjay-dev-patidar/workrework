import React from "react";
import  { useState, useEffect } from "react";

import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import axios from "axios";
import { chakra } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionButton = chakra(motion.button);

const Header = ({ activeButton, onSetActiveButton, setSelectedDocument, setSelectedCollectionAndTitle }) => {
  const [documentTitles, setDocumentTitles] = useState({
    ageofai: [],
    webdev: [],
    devtools: [],
    road: [], // Add road collection titles
  });

  useEffect(() => {
    fetchData("ageofai");
    fetchData("webdev");
    fetchData("devtools");
    fetchData("road"); // Fetch data for "road" collection
  }, []);

  const fetchData = (collection) => {
    axios
      .get(`http://localhost:5000/api/${collection}`)
      .then((response) => {
        setDocumentTitles((prevTitles) => ({
          ...prevTitles,
          [collection]: response.data.map((item) => item.title),
        }));
      })
      .catch((error) => {
        console.error(`Error fetching data from ${collection} collection.`, error);
      });
  };

  const MoreDropdownMenu = React.forwardRef(({ collection, titles }, ref) => (
    <Menu ref={ref}>
      {titles.map((title) => (
        <Menu.Item key={title}>
          <MotionButton
            whileTap={{ scale: 0.9 }}
            whileHover={{ y: -5, boxShadow: "0 0 10px #5F46E5", borderColor: "#5F46E5" }}
            onClick={() => fetchDocumentData(collection, title)}
            variant="primary"
          >
            {title}
          </MotionButton>
        </Menu.Item>
      ))}
    </Menu>
  ));

  const DropdownMenu = React.forwardRef(({ collection }, ref) => {
    const [showMore, setShowMore] = useState(false);
    const titles = documentTitles[collection];

    useEffect(() => {
      setShowMore(titles.length > 10);
    }, [titles]);

    return (
      <Menu ref={ref}>
        {titles.slice(0, showMore ? 10 : titles.length).map((title) => (
          <Menu.Item key={title}>
            <MotionButton
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -5, boxShadow: "0 0 10px #5F46E5", borderColor: "#5F46E5" }}
              onClick={() => fetchDocumentData(collection, title)}
              variant="primary"
            >
              {title}
            </MotionButton>
          </Menu.Item>
        ))}
        {showMore && (
          <Menu.Item key="more">
            <Dropdown.Button
              onClick={() => setShowMore(false)}
              overlay={<MoreDropdownMenu collection={collection} titles={titles.slice(10)} />}
              placement="bottomLeft"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ cursor: 'pointer' }}
              >
                More...
              </motion.div>
            </Dropdown.Button>
          </Menu.Item>
        )}
      </Menu>
    );
  });

  const fetchDocumentData = (collection, title) => {
    axios
      .get(`http://localhost:5000/api/${collection}?title=${encodeURIComponent(title)}`)
      .then((response) => {
        setSelectedDocument(response.data.find((item) => item.title === title));
        setSelectedCollectionAndTitle({ collection, title });
        onSetActiveButton(collection);
      })
      .catch((error) => {
        console.error("Error fetching document data.", error);
      });
  };

  return (
    <header className="bg-gray-800 text-white p-4 mt-16 sticky top-0" style={{ zIndex: "999" }}>
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        <div>
          <Dropdown
            overlay={<DropdownMenu collection="devtools" />}
            trigger={["hover"]}
            placement="bottomLeft"
            onVisibleChange={(visible) => onSetActiveButton(visible ? "devtools" : null)}
          >
            <MotionButton
              whileTap={{ scale: 0.9 }}
              style={buttonStyle}
              variant="primary"
            >
              Dev Tools <DownOutlined />
            </MotionButton>
          </Dropdown>
          <Dropdown
            overlay={<DropdownMenu collection="webdev" />}
            trigger={["hover"]}
            placement="bottomLeft"
            onVisibleChange={(visible) => onSetActiveButton(visible ? "webdev" : null)}
          >
            <MotionButton
              whileTap={{ scale: 0.9 }}
              style={buttonStyle}
              variant="primary"
            >
              Web Development <DownOutlined />
            </MotionButton>
          </Dropdown>
          <Dropdown
            overlay={<DropdownMenu collection="ageofai" />}
            trigger={["hover"]}
            placement="bottomLeft"
            onVisibleChange={(visible) => onSetActiveButton(visible ? "ageofai" : null)}
          >
            <MotionButton
              whileTap={{ scale: 0.9 }}
              style={buttonStyle}
              variant="primary"
            >
              The Age of AI <DownOutlined />
            </MotionButton>
          </Dropdown>
          {/* New Dropdown for "Guided Roadmap" */}
          <Dropdown
            overlay={<DropdownMenu collection="road" />}
            trigger={["hover"]}
            placement="bottomLeft"
            onVisibleChange={(visible) => onSetActiveButton(visible ? "road" : null)}
          >
            <MotionButton
              whileTap={{ scale: 0.9 }}
              style={buttonStyle}
              variant="primary"
            >
              Guided Roadmap <DownOutlined />
            </MotionButton>
          </Dropdown>
        </div>
      </nav>
    </header>
  );
};

const buttonStyle = {
  margin: "0.5rem",
  padding: "0.5rem 1rem",
  cursor: "pointer",
  color: "#FFFFFF",
  fontWeight: "bold",
  border: "1px solid transparent",
  background: "linear-gradient(135deg, #6C63FF, #4F46E5)",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  borderRadius: "5px",
  transition: "all 0.2s ease-in-out",

  ":hover": {
    transform: "scale(1.1)",
    boxShadow: "0 0 10px #5F46E5",
    borderColor: "#5F46E5",
  },
};

export default Header;
