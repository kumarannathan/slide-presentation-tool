import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';

const PresentationPreview = () => {
  const [transition, setTransition] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const [selectedTextBox] = useState(null);

  // text
  const [textBoxes, setTextBoxes] = useState([]);

  // code
  const [codeSnippets, setCodeSnippets] = useState([]);

  // some css
  const BackgroundStyle = { background: 'white', minHeight: '100vh' }
  const slideNumberStyle = { position: 'absolute', bottom: 0, left: 0, padding: '20px', paddingBottom: '30px', width: '100vw', height: '50px', borderRadius: '10px', fontSize: '1em', color: 'anyColor', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)' };
  const slideViewerContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'gray',
    aspectRatio: '2 / 1',
    borderRadius: '10px',
    width: '100vw',
    height: '100vh',
    margin: 'auto',
    padding: '10%',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.5s ease-in-out',
    ...(transition && { opacity: 0 }),
  };

  const editButtonStyle = { paddingLeft: '5%' };

  const renderTextBoxes = () => {
    return textBoxes.map(box => (
      <Draggable
        key={box.id}
        defaultPosition={{ x: box.x, y: box.y }}
        bounds="parent"
        // onStop={(e, data) => handleDragStop(box.id, data)}
      >
        <div
          style={{
            position: 'absolute',
            color: box.color,
            fontSize: `${box.size}px`,
            fontFamily: `${box.fontStyle}`, // Apply the selected font family
            cursor: 'move',
            border: selectedTextBox && selectedTextBox.id === box.id ? '2px solid blue' : 'none', // Apply border if selected
            paddingleft: `${box.x}%`,
            paddingtop: `${box.y}%`
          }}
        >
          {box.content}
        </div>
      </Draggable>
    ));
  };

  const renderCodeSnippets = () => {
    return codeSnippets.map(snippet => (
      <Draggable
        key={snippet.id}
        defaultPosition={{ x: snippet.x, y: snippet.y }}
        bounds="parent"
      >
        <div
          style={{
            position: 'absolute',
            color: '#000000',
            fontSize: `${snippet.size}%`,
            cursor: 'move',
            border: '2px solid gray',
            padding: '5px',
            boxSizing: 'border-box',
            whiteSpace: 'pre-wrap',
            backgroundColor: '#f5f5f5'
          }}
        >
          {snippet.content}
        </div>
      </Draggable>
    ));
  };

  const renderBackground = () => {
    const localPresentationData = JSON.parse(localStorage.getItem('thisPresentation'));
    const slideIndex = currentSlide;
    const backgroundData = localPresentationData.slides[slideIndex].background;

    let style = {};
    // console.log('current slid ebackground', backgroundData);
    const defaultBackgroundColor = 'lightgray';

    if (backgroundData) {
      if (backgroundData.includes('gradient')) {
        style = { backgroundImage: backgroundData };
        console.log('havet implemented gradiet yet');
      } else {
        style = { background: backgroundData };
      }
    } else {
      style = { background: defaultBackgroundColor }; // Use default color
    }

    return style;
  };

  const renderPhotos = () => {
    const localPresentationData = JSON.parse(localStorage.getItem('thisPresentation'));
    const slideIndex = currentSlide;
    const images = localPresentationData.slides[slideIndex].images;

    console.log('Rendering images for current slide:', images);

    return images.map((image, index) => (

      <div key={index} style={{ position: 'absolute', left: `${image.x}px`, top: `${image.y}px` }}>
      <img
      src={image.url}
      style={{
        width: `${image.size}%`,
        cursor: 'move',
        left: `${image.x}`,
        top: `${image.y}`
      }}
      >
      </img>
      </div>
    ));
  };

  const renderVideos = () => {
    const localPresentationData = JSON.parse(localStorage.getItem('thisPresentation'));
    const slideIndex = currentSlide;
    const videos = localPresentationData.slides[slideIndex].video;

    console.log('Rendering videos for current slide:', videos);

    return videos.map((video, index) => (
      <div key={index} style={{ width: `${video.size}%`, height: `${video.size}%`, position: 'absolute', left: `${video.x}px`, right: `${video.y}px` }}>
      <iframe
         src={video.url}
        width={`${video.size}%`}
         height={`${video.size}%`}
         title="YouTube video player"
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
         allowFullScreen
      >
      </iframe>
      </div>
    ));
  };

  // navigating slides
  const goToSlide = (slideIndex) => {
    if (slideIndex >= 0 && slideIndex < slideCount) {
      console.log('current slide: ', slideIndex);
      setCurrentSlide(slideIndex);
    }
  };

  const handlePreviousSlide = () => {
    const prevSlide = currentSlide - 1;
    if (prevSlide >= 0) {
      // console.log('in go to slide prev');
      goToSlide(prevSlide);
    }
  };

  const handleNextSlide = () => {
    // console.log('slid ecount: ' , slideCount);
    const nextSlide = currentSlide + 1;
    if (nextSlide < slideCount + 1) {
      // console.log('in go to slide next');
      goToSlide(nextSlide);
    }
  };

  // use effects
  useEffect(() => {
    setTransition(true);
    const timeout = setTimeout(() => {
      setTransition(false);
    }, 400); // 0.4 seconds

    return () => clearTimeout(timeout);
  }, [currentSlide]);

  useEffect(() => {
    const fetchSlideData = () => {
      const localPresentationData = JSON.parse(localStorage.getItem('thisPresentation'));
      if (localPresentationData) {
        setSlideCount(localPresentationData.slides.length);
        console.log('Slide count after fetching:', slideCount);
        const slideData = localPresentationData.slides[currentSlide];
        console.log('Slide data:', slideData);

        const textObjects = slideData.text || [];
        const codeObjects = slideData.code || [];

        setTextBoxes(textObjects);
        setCodeSnippets(codeObjects);

        // }
      }
    };

    fetchSlideData();
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'ArrowRight') {
        handleNextSlide();
      } else if (event.key === 'ArrowLeft') {
        handlePreviousSlide();
      }
    };
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentSlide, slideCount]);

  return (
    <>
      <body style={BackgroundStyle}>
        {/* Slide Num Box */}
        <div style={{
          ...slideViewerContainerStyle,
          ...renderBackground(), // Apply dynamic background
        }} >
          {renderTextBoxes()}
          {renderCodeSnippets()}
          {renderPhotos()}
          {renderVideos()}
          <div className="container-fluid p-0" style={{ flex: 1 }}>
            <div style={slideNumberStyle}>
              {currentSlide + 1}
              <div className="mt-3 ms-auto" style={editButtonStyle}>
          <button className="btn btn-outline-primary me-2" onClick={handlePreviousSlide}>
            <img src="/images/arrow.png" alt="Previous" style={{ width: '16px', height: '16px', transform: 'rotate(180deg)' }} />
          </button>
          <button className="btn btn-outline-primary" onClick={handleNextSlide}>
            <img src="/images/arrow.png" alt="Next" style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default PresentationPreview;
