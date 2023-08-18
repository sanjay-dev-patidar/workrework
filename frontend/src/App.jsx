import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Navbar, Header, Home, Blogs, Footer } from "./components";
import SectionWrapper from "./hoc/SectionWrapper";


const HomeWithSectionWrapper = SectionWrapper(Home, "home");

const App = () => {
  const [activeButton, setActiveButton] = useState("ageofai");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedCollectionAndTitle, setSelectedCollectionAndTitle] = useState(null);

  useEffect(() => {
    fetchInitialDocumentData();
  }, []);

  const fetchInitialDocumentData = async () => {
    try {
      const response = await fetch("/api/ageofai");
      const data = await response.json();
      if (data.length > 0) {
        setSelectedDocument(data[0]);
      }
    } catch (error) {
      console.error("Error fetching initial document data:", error);
    }
  };

  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
          <Navbar />
          <Header
            activeButton={activeButton}
            onSetActiveButton={setActiveButton}
            setSelectedDocument={setSelectedDocument}
            setSelectedCollectionAndTitle={setSelectedCollectionAndTitle}
          />
          <HomeWithSectionWrapper
            selectedDocument={selectedDocument}
            selectedCollectionAndTitle={selectedCollectionAndTitle}
          />
        </div>
     
        <Blogs />
        <div className="relative z-0">
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;