import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';

const EditPresentation = () => {
  const { presentationId } = useParams();
  const [transition, setTransition] = useState(false);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSlideModal, setShowDeleteSlideModal] = useState(false);
  const [showEditTitleModal, setShowEditTitleModal] = useState(false);
  const [title, setTitle] = useState('');
  const [slides, setSlides] = useState([{ id: 1 }]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideCount, setSlideCount] = useState(0);
  const [selectedTextBox, setSelectedTextBox] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const navBarButtonStyle = { margin: '1px' };
  // text
  const [showTextEditModal, setShowTextEditModal] = useState(false);
  const [text, setText] = useState('');
  const [textSize, setTextSize] = useState(50);
  const [textColor, setTextColor] = useState('#000000');
  const [textBoxes, setTextBoxes] = useState([]);
  const [activeTextBox, setActiveTextBox] = useState(null);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textX, setTextX] = useState(0);
  const [textY, setTextY] = useState(0);
  // code
  const [showCodeEditModal, setShowCodeEditModal] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('C');
  const [codeFontSize, setCodeFontSize] = useState(50);
  const [codeSnippets, setCodeSnippets] = useState([]);
  const [activeCodeSnippet, setActiveCodeSnippet] = useState(null);
  const [codeX, setCodeX] = useState(0);
  const [codeY, setCodeY] = useState(0);

  // photo
  const [showPhotoEditModal, setShowPhotoEditModal] = useState(false);
  const [imageSize, setImageSize] = useState(50);
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [photoX, setPhotoX] = useState(0);
  const [photoY, setPhotoY] = useState(0);

  // new
  const [photos, setPhotos] = useState([]);
  const photoRefs = useRef([]);
  photoRefs.current = photos.map((_, i) => photoRefs.current[i] || React.createRef());
  const [selectedImageId, setSelectedImageId] = useState(null);

  // video
  const [showVideoEditModal, setShowVideoEditModal] = useState(false);
  const [showEditingVideoModal, setShowEditingVideoModal] = useState(false)
  const [videoSize, setVideoSize] = useState(50);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoAutoplay, setVideoAutoplay] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [activeOverlays, setActiveOverlays] = useState({});
  const [videoX, setVideoX] = useState(0);
  const [videoY, setVideoY] = useState(0);

  // theme edit tools
  const [showBackgroundEditModal, setShowBackgroundEditModal] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [backgroundGradient, setBackgroundGradient] = useState('');
  const [applyToAllSlides, setApplyToAllSlides] = useState(false);

  // version history
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versionHistory, setVersionHistory] = useState([]);

  // some css
  const PermBtnStyle = { margin: '5px', height: '55px' };
  const AlertStyle = { fontStyle: 'italic', fontWeight: 'lighter' };
  const slideNumberStyle = { position: 'absolute', bottom: 0, left: 0, width: '50px', height: '50px', borderRadius: '10px', fontSize: '1em', color: 'anyColor', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)' };
  const slideViewerContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor,
    aspectRatio: '2 / 1',
    borderRadius: '10px',
    width: '90%',
    margin: '2% auto',
    padding: '1%',
    position: 'relative',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
    overflow: 'hidden',
    transition: 'all 0.5s ease-in-out',
    ...(transition && { opacity: 0 }),
  };
  const editButtonStyle = { paddingLeft: '5%' };
  const vhStyle = { backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', position: 'fixed', right: 0, top: 0, bottom: 0, overflowY: 'auto', borderRadius: '20px 0 0 20px', backdropFilter: 'blur(10px)', borderLeft: '1px solid rgba(255, 255, 255, 0.2)' };

  // Inline styles
  const navbarBrandStyle = {
    cursor: 'pointer',
    color: 'white',
    fontSize: '1.5rem',
    marginLeft: '2%'
  };

  const navbarButtonStyle = {
    marginLeft: '10px',
  };

  const [theme, setTheme] = useState('light');
  const themes = {
    light: {
      background: '#E0DDDD',
      minHeight: '100vh',
      color: '#333',
      paddingBottom: '2%'
    },
    dark: {
      backgroundColor: 'black',
      minHeight: '100vh',
      color: 'white',
      paddingBottom: '2%'
    }
  };
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // photo func
  const handleFileChange = event => {
    const imageRatio = imageSize / 100;
    console.log('size=', imageSize);
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: photos.length,
          url: e.target.result,
          size: (imageSize * imageRatio),
          x: photoX,
          y: photoY
        };
        setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
        console.log('after file change set photos', photos);
        const localPresentationData = JSON.parse(localStorage.getItem('store'));
        const presentationIndex = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
        const slideIndex = currentSlide;
        localPresentationData.presentations[presentationIndex].slides[slideIndex].images.push(newPhoto);
        localStorage.setItem('store', JSON.stringify(localPresentationData));
      };
      reader.readAsDataURL(file);
    }
  };

  // edit presentation title
  function updatePresTitle (presentationId, newPresName) {
    const localPresentations = JSON.parse(localStorage.getItem('store'));
    const index = localPresentations.presentations.findIndex(presentation => presentation.id === presentationId);
    localPresentations.presentations[index].name = newPresName;
    console.log('new name in local storage', localPresentations.presentations[index].name);
    localStorage.setItem('store', JSON.stringify(localPresentations));

    const updatedPresentations = JSON.parse(localStorage.getItem('store'));
    const token = localStorage.getItem('token');
    const payload = { store: updatedPresentations };
    return fetch('http://localhost:5005/store', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch presentations');
        }
        return response.json();
      })
      .then(data => {
      })
      .catch(error => {
        console.error('Error fetching presentations:', error);
        throw error;
      });
  }

  const handleTitleChangeConfirm = (presentationId, newName) => {
    updatePresTitle(presentationId, newName)
      .then(() => {
      })
      .catch(error => {
        console.error('Error updating presentation title:', error);
      });
  };

  // fetching info functions
  function fetchPresInfo (presentationId) {
    const token = localStorage.getItem('token');
    return fetch('http://localhost:5005/store', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch presentations');
        }
        return response.json();
      })
      .then(data => {
        const presentations = data.store.store.presentations;
        const presentation = presentations.find(p => p.id === presentationId);
        if (presentation) {
          setTitle(presentation.name);
          return presentation;
        } else {
          throw new Error('Presentation not found');
        }
      })
      .catch(error => {
        console.error('Error fetching presentations:', error);
        throw error;
      });
  }

  function fetchPresentations2 () {
    const token = localStorage.getItem('token');
    return fetch('http://localhost:5005/store', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch presentations');
        }
        return response.json();
      })
      .then(data => {
        return data.store.store.presentations;
      })
      .catch(error => {
        console.error('Error fetching presentations:', error);
        throw error;
      });
  }

  // deleting presentation and slides
  const handleDeleteConfirm = () => {
    console.log('Deleting presentation with ID:', presentationId);
    updateDatabaseAfterDeleting();
    navigate('/Dashboard/');
  };

  const handleDeleteSlide = () => {
    if (slideCount === 1) {
      alert('Cannot delete the only slide. Delete the presentation instead.');
    } else {
      console.log('Deleting slide in', presentationId);
      deleteSlide();
      console.log('cr', currentSlide);
      if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
      } else {
        goToSlide(currentSlide + 1);
      }
    }
    setSlideCount(slideCount - 1);
  };

  const deleteSlide = () => {
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const index = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
    localPresentationData.presentations[index].slides.splice(currentSlide, 1);
    localStorage.setItem('store', JSON.stringify(localPresentationData));
    console.log('Slide removed from local storage!');
  };

  const deletePresentation = () => {
    return fetchPresentations2()
      .then(data => {
        const pres = data;
        const index = pres.findIndex(presentation => presentation.id === presentationId);
        if (index !== -1) {
          pres.splice(index, 1);
          console.log('Presentation deleted:', presentationId);
          console.log('Updated presentations:', pres);
          return pres;
        } else {
          console.log('Presentation not found:', presentationId);
          return null;
        }
      })
      .catch(error => {
        console.error('Error fetching presentations:', error);
        throw error;
      });
  };

  const updateDatabaseAfterDeleting = () => {
    deletePresentation()
      .then(updatedPresentations => {
        if (updatedPresentations !== null) {
          const token = localStorage.getItem('token');
          localStorage.setItem('store', JSON.stringify({ presentations: updatedPresentations }));
          const payload = { store: { presentations: updatedPresentations } };
          return fetch('http://localhost:5005/store', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token
            },
            body: JSON.stringify(payload)
          });
        } else {
          console.log('Cannot update database: Presentation not found');
          return null;
        }
      })
      .then(response => {
        if (response !== null && response.ok) {
          console.log('Database updated successfully after deleting presentation');
        } else {
          throw new Error('Failed to update database after deleting presentation');
        }
      })
      .catch(error => {
        console.error('Error updating database after deleting presentation:', error);
      });
  };

  // add slides
  const addNewSlide = async () => {
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const presentationIndex = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
    const newSlideIndex = localPresentationData.presentations[presentationIndex].slides.length;

    const newSlideData = {
      id: newSlideIndex,
      date: [],
      text: [],
      code: [],
      images: [],
      theme: [],
      video: [],
      background: 'white'
    };

    localPresentationData.presentations[presentationIndex].slides[newSlideIndex] = newSlideData;
    localStorage.setItem('store', JSON.stringify(localPresentationData));
    // console.log('new slide to local storage');
    setSlides([...slides, newSlideData]);
    setSlideCount(localPresentationData.presentations[presentationIndex].slides.length);
    setCurrentSlide(slides.length);
  };

  // add text

  const handleTextBoxClick = (box) => {
    setSelectedTextBox(box);
  };

  const renderTextBoxes = () => {
    return textBoxes.map(box => (
      <Draggable
        key={box.id}
        defaultPosition={{ x: box.x, y: box.y }}
        bounds="parent"
        onStop={(e, data) => handleDragStop(box.id, data)}
      >
        <div
          style={{
            position: 'absolute',
            color: box.color,
            fontSize: `${box.size}px`,
            fontFamily: `${box.fontStyle}`, // Apply the selected font family
            cursor: 'move',
            border: selectedTextBox && selectedTextBox.id === box.id ? '2px solid lightgray' : 'none', // Apply border if selected
            paddingleft: `${box.x}%`,
            paddingtop: `${box.y}%`,

          }}
          onClick={() => handleTextBoxClick(box)}
          onDoubleClick={() => handleTextBoxDoubleClick(box)}
          onContextMenu={(e) => handleRightClickOnBox(e, box.id)}
        >
          {box.content}
        </div>
      </Draggable>
    ));
  };

  const saveTextBoxToLocalStorage = (textBox) => {
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const presentationIndex = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
    const slideIndex = currentSlide;
    const textBoxIndex = localPresentationData.presentations[presentationIndex].slides[slideIndex].text.findIndex(tb => tb.id === textBox.id);
    if (textBoxIndex !== -1) {
      localPresentationData.presentations[presentationIndex].slides[slideIndex].text[textBoxIndex] = textBox;
      localStorage.setItem('store', JSON.stringify(localPresentationData));
    } else {
      console.error('Textbox not found in local storage:', textBox.id);
    }
  };

  const handleDragStop = (id, data) => {
    // console.log(`Snippet ${id} dragged to: x=${data.x}, y=${data.y}`);
    setTextBoxes(prevTextBoxes => prevTextBoxes.map(box =>
      box.id === id ? { ...box, x: data.x, y: data.y } : box
    ));

    const textBox = textBoxes.find(box => box.id === id);

    if (textBox) {
      const updatedTextBox = { ...textBox, x: data.x, y: data.y };
      saveTextBoxToLocalStorage(updatedTextBox);
    } else {
      console.error('Textbox not found with id:', id);
    }
  };

  const handleTextSubmit = async () => {
    const nextId = textBoxes.length;
    if (activeTextBox) {
      setTextBoxes(prevTextBoxes => prevTextBoxes.map(box => {
        if (box.id === activeTextBox.id) {
          const updatedTextBox = {
            ...box,
            content: text,
            size: textSize,
            color: textColor,
            fontStyle: fontFamily,
            x: textX,
            y: textY
          };
          saveTextBoxToLocalStorage(updatedTextBox);
          return updatedTextBox;
        }

        return box;
      }));
    } else {
      const newTextBox = {
        id: nextId,
        slideNum: currentSlide,
        content: text,
        size: textSize,
        color: textColor,
        fontStyle: fontFamily,
        x: textX,
        y: textY
      };
      setTextBoxes(prevTextBoxes => [...prevTextBoxes, newTextBox]);

      const localPresentationData = JSON.parse(localStorage.getItem('store'));
      const presentationIndex = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
      const slideIndex = currentSlide;

      localPresentationData.presentations[presentationIndex].slides[slideIndex].text.push(newTextBox);
      localStorage.setItem('store', JSON.stringify(localPresentationData));
      // console.log('text stored in local storage');
    }
    setShowTextEditModal(false);
    resetTextForm();
  };

  const handleTextBoxDoubleClick = (box) => {
    setSelectedTextBox(selectedTextBox);
    // console.log("select textbox:" , selectedTextBox);
    setActiveTextBox(box);
    setShowTextEditModal(true);
    setText(box.content);
    setTextSize(box.size);
    setTextColor(box.color);
    setFontFamily(box.fontStyle);
    box.x = textX;
    box.y = textY;
    renderTextBoxes();
  };

  const resetTextForm = () => {
    setText('');
    setTextSize(50);
    setTextColor('#000000');
    setActiveTextBox(null);
    setTextX(0);
    setTextY(0);
  };

  // right click to delete elements
  const handleRightClickOnBox = (event, id) => {
    event.preventDefault();
    const textboxIndex = textBoxes.findIndex(box => box.id === id);
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const index = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
    localPresentationData.presentations[index].slides[currentSlide].text.splice(textboxIndex, 1);
    localStorage.setItem('store', JSON.stringify(localPresentationData));
    setTextBoxes(prevTextBoxes => prevTextBoxes.filter(text => text.id !== id));
    setSlides([...localPresentationData.presentations[index].slides]);
  };

  const handleRightClickOnSnippet = (event, id) => {
    event.preventDefault();
    const codeIndex = codeSnippets.findIndex(box => box.id === id);
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const index = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
    localPresentationData.presentations[index].slides[currentSlide].code.splice(codeIndex, 1);
    localStorage.setItem('store', JSON.stringify(localPresentationData));
    console.log('delete code');
    setCodeSnippets(prevSnippets => prevSnippets.filter(snippet => snippet.id !== id));
    setSlides([...localPresentationData.presentations[index].slides]);
  };

  const handleRightClickOnImage = (event, id) => {
    event.preventDefault();
    const photoIndex = photos.findIndex(box => box.id === id);
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const index = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
    localPresentationData.presentations[index].slides[currentSlide].images.splice(photoIndex, 1);
    localStorage.setItem('store', JSON.stringify(localPresentationData));
    console.log('delete photo');
    setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id));
    setSlides([...localPresentationData.presentations[index].slides]);
  };

  const handleRightClickOnVideo = (event, id) => {
    event.preventDefault();
    const videoIndex = videos.findIndex(video => video.id === id);
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const presentationIndex = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);

    if (presentationIndex === -1) {
      console.error('Presentation not found!');
      return;
    }
    if (videoIndex !== -1) {
      localPresentationData.presentations[presentationIndex].slides[currentSlide].video.splice(videoIndex, 1);
      localStorage.setItem('store', JSON.stringify(localPresentationData));
      console.log('delete video', id);
      setVideos(prevVideos => prevVideos.filter(video => video.id !== id));
      setSlides([...localPresentationData.presentations[presentationIndex].slides]);
    } else {
      console.error('Video not found:', id);
    }
  };

  const renderCodeSnippets = () => {
    return codeSnippets.map(snippet => (
      <Draggable
        key={snippet.id}
        defaultPosition={{ x: snippet.x, y: snippet.y }}
        bounds="parent"
        onStop={(e, data) => handleCodeDragStop(snippet.id, data)}
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
          onDoubleClick={() => handleCodeDoubleClick(snippet)}
          onContextMenu={(e) => handleRightClickOnSnippet(e, snippet.id)} // Right-click handler
        >
          {snippet.content}
        </div>
      </Draggable>
    ));
  };

  const handleCodeDragStop = (id, data) => {
    setCodeSnippets(prevSnippets =>
      prevSnippets.map(snippet =>
        snippet.id === id ? { ...snippet, x: data.x, y: data.y } : snippet
      )
    );

    const snippet = codeSnippets.find(snippet => snippet.id === id);

    if (snippet) {
      const updatedSnippet = { ...snippet, x: data.x, y: data.y };
      saveCodeSnippetToLocalStorage(updatedSnippet);
    } else {
      console.error('Snippet not found with id:', id);
    }
  };

  const saveCodeSnippetToLocalStorage = (snippet) => {
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const presentationIndex = localPresentationData.presentations.findIndex(
      (presentation) => presentation.id === presentationId
    );
    const slideIndex = currentSlide;
    const snippetIndex = localPresentationData.presentations[presentationIndex].slides[
      slideIndex
    ].code.findIndex((snip) => snip.id === snippet.id);

    if (snippetIndex !== -1) {
      localPresentationData.presentations[presentationIndex].slides[slideIndex].code[
        snippetIndex
      ] = snippet;
      localStorage.setItem('store', JSON.stringify(localPresentationData));
      // console.log('Changes to snippet saved to local storage:', snippet);
    } else {
      console.error('Snippet not found in local storage:', snippet.id);
    }
  };

  const handleCodeSubmit = () => {
    const nextId = codeSnippets.length;
    if (activeCodeSnippet) {
      setCodeSnippets(prevSnippets => prevSnippets.map(snippet => {
        if (snippet.id === activeCodeSnippet.id) {
          return { ...snippet, content: code, size: codeFontSize, language };
        }
        const localPresentationData = JSON.parse(localStorage.getItem('store'));
        const presentationIndex = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
        const slideIndex = currentSlide;
        localPresentationData.presentations[presentationIndex].slides[slideIndex].code[snippet.id] = snippet;
        localStorage.setItem('store', JSON.stringify(localPresentationData));
        return snippet;
      }));
    } else {
      const newCodeSnippet = {
        id: nextId,
        content: code,
        size: codeFontSize,
        language,
        x: codeX,
        y: codeY
      };

      setCodeSnippets(prevSnippets => [...prevSnippets, newCodeSnippet]);

      const localPresentationData = JSON.parse(localStorage.getItem('store'));
      const presentationIndex = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
      const slideIndex = currentSlide;
      localPresentationData.presentations[presentationIndex].slides[slideIndex].code.push(newCodeSnippet);
      localStorage.setItem('store', JSON.stringify(localPresentationData));
      // console.log('Code stored in local storage');
    }

    setShowCodeEditModal(false);
    resetCodeForm();
  };

  const handleCodeDoubleClick = (snippet) => {
    setActiveCodeSnippet(snippet);
    setShowCodeEditModal(true);
    setCode(snippet.content);
    setCodeFontSize(snippet.size);
    setLanguage(snippet.language);
    snippet.x = codeX;
    snippet.y = codeY;
  };

  const resetCodeForm = () => {
    setCode('');
    setCodeFontSize(50);
    setLanguage('C');
    setActiveCodeSnippet(null);
  };

  // theme edit tools
  const handleBackgroundConfirm = () => {
    const finalBackground = backgroundGradient ? `${backgroundGradient}` : backgroundColor;
    if (applyToAllSlides) {
      console.log('applied to all');
      console.log(finalBackground);
      updateAllSlidesBackground(finalBackground);
    } else {
      // Apply to current slide only
      updateCurrentSlideBackground(finalBackground);
    }
    setShowBackgroundEditModal(false);
    resetBackgroundForm();
  };

  const updateCurrentSlideBackground = (background) => {
    // Update the background of the current slide only
    setSlides(slides.map((slide, index) => {
      if (index === currentSlide) {
        console.log('hi');
        return { ...slide, background };
      }
      return slide;
    }));
    saveBackgroundToLocalStorage(background);
  };

  const updateAllSlidesBackground = (background) => {
    console.log("Starting to update all slides' backgrounds to:", background);
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const presentationIndex = localPresentationData.presentations.findIndex(p => p.id === presentationId);
    if (presentationIndex === -1) {
      console.error('Presentation not found!');
      return;
    }
    const updatedSlides = localPresentationData.presentations[presentationIndex].slides.map(slide => ({
      ...slide,
      background
    }));
    console.log('Updated slides:', updatedSlides);
    setSlides(updatedSlides);
    localPresentationData.presentations[presentationIndex].slides = updatedSlides;
    localStorage.setItem('store', JSON.stringify(localPresentationData));
    console.log('All slides updated and saved to local storage.');
  };

  const saveBackgroundToLocalStorage = (background) => {
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const presentationIndex = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
    const slideIndex = currentSlide;

    localPresentationData.presentations[presentationIndex].slides[slideIndex].background = background;
    console.log('local storage background:', background);
    console.log('local storage background2:', backgroundGradient);
    console.log('local storage background3:', backgroundColor);
    localStorage.setItem('store', JSON.stringify(localPresentationData));
    // console.log('Changes to background saved to local storage:', background);
  };

  const renderBackground = () => {
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const presentationIndex = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
    const slideIndex = currentSlide;
    const backgroundData = localPresentationData.presentations[presentationIndex].slides[slideIndex].background;

    let style = {};
    // console.log('current slid ebackground', backgroundData);
    const defaultBackgroundColor = 'white';

    console.log('backgorund data', backgroundData);
    if (backgroundData) {
      if (backgroundData.includes('gradient')) {
        style = { backgroundImage: backgroundData };
      } else {
        style = { background: backgroundData };
        console.log('backgorund ', backgroundData);
        console.log('applying this');
      }
    } else {
      style = { background: defaultBackgroundColor }; // Use default color
    }

    return style;
  };

  const resetBackgroundForm = () => {
    setBackgroundColor('');
    setBackgroundGradient('');
    setApplyToAllSlides(false);
  }
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

  // adding photo functions

  const handlePhotoConfirm = () => {
    console.log('photo url', imageUrl);
    console.log('photo url', imageFile);
    // if image url
    if (imageUrl) {
      renderImageFromUrl();
    }
    setShowPhotoEditModal(false);
    resetPhotoForm();
  }
  const resetPhotoForm = () => {
    setImageSize(50);
    setImageFile('');
    setImageUrl('');
    setPhotoX(0);
    setPhotoY(0);
  };
  const renderPhotos = () => {
    return photos.map((photo, index) => (
      <Draggable
        key={photo.id}
        defaultPosition={{ x: photo.x, y: photo.y }}
        onStop={(e, data) => handlePhotoDragStop(photo.id, data)}
        bounds="parent"
      >
        <img
          src={photo.url}
          ref={photoRefs.current[index]}
          style={{
            width: `${photo.size}%`,
            cursor: 'move',
            position: 'relative',
            border: selectedImageId === photo.id ? '2px solid blue' : 'none'
          }}
          alt={`Slide Photo ${photo.id}`}
          onClick={() => setSelectedImageId(photo.id)}
          onDoubleClick={() => handlePhotoDoubleClick(photo)}
          onContextMenu={(e) => handleRightClickOnImage(e, photo.id)}

        />
      </Draggable>
    ));
  };

  const renderImageFromUrl = () => {
    console.log(imageUrl);
    console.log(photos);
    const newPhoto = {
      id: photos.length,
      url: imageUrl,
      size: imageSize,
      x: photoX,
      y: photoY
    };

    // save to local storage:

    setPhotos(prevPhotos => [...prevPhotos, newPhoto]);
    console.log('after redner imgae from url ', photos);
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const presentationIndex = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
    const slideIndex = currentSlide;
    localPresentationData.presentations[presentationIndex].slides[slideIndex].images.push(newPhoto);
    localStorage.setItem('store', JSON.stringify(localPresentationData));
  };

  const savePhotoToLocalStorage = (updatedPhotos) => {
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const presentationIndex = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
    const slideIndex = currentSlide;

    // Update the slides with the new photo data
    localPresentationData.presentations[presentationIndex].slides[slideIndex].images = updatedPhotos;
    localStorage.setItem('store', JSON.stringify(localPresentationData));
  };

  const saveVideoToLocalStorage = (updatedVideo) => {
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const presentationIndex = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
    const slideIndex = currentSlide;
    console.log('video saving to local storage', updatedVideo);
    // Update the slides with the new photo data
    localPresentationData.presentations[presentationIndex].slides[slideIndex].video = updatedVideo;
    localStorage.setItem('store', JSON.stringify(localPresentationData));
  };

  const handlePhotoDragStop = (id, data) => {
    const updatedPhotos = photos.map(photo => {
      if (photo.id === id) {
        return { ...photo, x: data.x, y: data.y };
      }
      return photo;
    });
    setPhotos(updatedPhotos);

    // Save the updated photos to local storage
    savePhotoToLocalStorage(updatedPhotos);
  };

  const handlePhotoDoubleClick = (photo, id) => {
    const selectedSlide = slides.find(slide => slide.id === id);
    setSelectedImageId(photo.id);
    if (selectedSlide) {
      setImageUrl(selectedSlide.image.url);
      setImageSize(parseInt(selectedSlide.image.size, 10));
      setShowPhotoEditModal(true);
      setCurrentSlide(id - 1);
    }
    setShowPhotoEditModal(true);
    photo.x = photoX;
    photo.y = photoY;
  };

  // version control
  const toggleVersionHistory = () => {
    setShowVersionHistory(!showVersionHistory);
    if (!showVersionHistory) {
      fetchVersionHistory();
    }
  };

  const fetchVersionHistory = () => {
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const index = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
    const allVersions = localPresentationData.presentations[index].versions;
    console.log('fetched version history', allVersions);
    setVersionHistory(allVersions); // Set versionHistory directly to allVersions
  };

  const restoreVersion = (present) => {
    console.log('Restoring to version:', present);
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const index = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
    localPresentationData.presentations[index] = present;
    localStorage.setItem('store', JSON.stringify(localPresentationData));

    setSlides([...localPresentationData.presentations[index].slides]);
    setCurrentSlide(0);
  };

  const versionControl = () => {
    const currentDate = new Date().toISOString();
    const allPresentations = JSON.parse(localStorage.getItem('store'));
    const index = allPresentations.presentations.findIndex(presentation => presentation.id === presentationId);
    const addingToVersion = allPresentations.presentations[index];
    const copiedPresentation = JSON.parse(JSON.stringify(addingToVersion))
    // delete copiedPresentation.versions; //does this work?
    allPresentations.presentations[index].versions.push({ date: currentDate, present: copiedPresentation });
    localStorage.setItem('store', JSON.stringify(allPresentations));
  };

  const handleSaveButtonClick = () => {
    const token = localStorage.getItem('token');
    versionControl();
    const updatedPresentations = JSON.parse(localStorage.getItem('store'));
    const payload = { store: updatedPresentations };

    fetch('http://localhost:5005/store', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (response.ok) {
          console.log('Presentations data saved successfully');
        } else {
          throw new Error('Failed to save presentations data');
        }
      })
      .catch(error => {
        console.error('Error saving presentations data:', error);
      });
  };

  const intervalDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
  const initiateAutoSave = () => {
    setInterval(versionControl, intervalDuration);
  };
  // Call initiateAutoSave when the component mounts

  useEffect(() => {
    initiateAutoSave();
  }, []);
  // video editing tools
  const extractYouTubeID = (url) => {
    const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#]*).*/;
    const match = url.match(regex);
    return (match && match[7].length === 11) ? match[7] : false;
  };

  const handleVideoUpload = () => {
    const videoId = extractYouTubeID(videoUrl);
    if (!videoId) {
      alert('Please enter a valid YouTube URL.');
      return;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}${videoAutoplay ? '?autoplay=1' : ''}`;
    const newVideo = {
      id: videos.length, // Use the length of the array to generate a unique ID //might have to change this tbh
      url: embedUrl,
      size: videoSize,
      autoplay: videoAutoplay,
      x: videoX,
      y: videoY,
    };

    setVideos(prevVideos => [...prevVideos, newVideo]); // Update the videos state
    console.log('local stor video ', newVideo);
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const presentationIndex = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
    const slideIndex = currentSlide;
    localPresentationData.presentations[presentationIndex].slides[slideIndex].video.push(newVideo);
    localStorage.setItem('store', JSON.stringify(localPresentationData));
    resetVideoForm();
    setShowVideoEditModal(false); // Close the modal
  };

  const toggleOverlay = (id) => {
    setActiveOverlays(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderVideos = () => {
    return videos.map((video) => (
      <Draggable
        key={video.id}

        onStop={(e, data) => handleVideoDragStop(video.id, data)}
        defaultPosition={{ x: video.x, y: video.y }}
      >
        <div
          className="video-container"
          style={{
            width: `${video.size}%`,
            height: `${video.size}%`,
            cursor: 'move',
            margin: '5px',
            border: selectedVideoId === video.id ? '2px dashed blue' : 'none',
            position: 'absolute'
          }}
          onClick={() => setSelectedVideoId(video.id)}
        >
          <iframe
            width="100%"
            height="100%"
            src={video.url}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          {activeOverlays[video.id] && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'transparent',
                cursor: 'pointer'
              }}
              onClick={() => toggleOverlay(video.id)}
              onDoubleClick={() => handleVideoDoubleClick(video, video.id)}
              onContextMenu={(e) => handleRightClickOnVideo(e, video.id)}
            ></div>
          )}
          <button className="btn btn-dark" onClick={() => toggleOverlay(video.id)} style={{ position: 'absolute', top: 5, right: '5%' }}>
            {activeOverlays[video.id] ? 'Move' : 'Move'}
          </button>
          <button className="btn btn-dark" onClick={() => handleVideoDoubleClick(video, video.id)} style={{ position: 'absolute', top: 5, right: '20%' }}>
            Edit
          </button>
        </div>
      </Draggable>
    ));
  };

  const handleVideoDoubleClick = (video, id) => {
    const selectedSlide = slides.find(slide => slide.id === id);
    // selectedVideoId(video.id);
    if (selectedSlide) {
      setVideoUrl(selectedSlide.video.url);
      setVideoSize(parseInt(selectedSlide.video.size));
      setShowEditingVideoModal(true);
      setCurrentSlide(id - 1);
    }
    setShowEditingVideoModal(true);
    video.x = videoX;
    video.y = videoY;
    resetVideoForm();
  };

  const resetVideoForm = () => {
    setVideoSize(50);
    setVideoX(0);
    setVideoY(0);
    setVideoAutoplay(false);
    setSelectedVideoId(null);
    setVideoUrl('');
  };

  const handleVideoDragStop = (id, data) => {
    const updatedVideo = videos.map(video => {
      if (video.id === id) {
        return { ...video, x: data.x, y: data.y };
      }
      return video;
    });
    setVideos(updatedVideo);

    // Save the updated photos to local storage
    saveVideoToLocalStorage(updatedVideo);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.video-container')) {
        setSelectedVideoId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // use effects

  useEffect(() => {
    function handleClickOutside (event) {
      // Check if the click is outside every referenced photo
      const isOutside = photoRefs.current.every(ref => {
        return ref.current && !ref.current.contains(event.target);
      });
      if (isOutside) {
        setSelectedImageId(null); // Deselect image if clicking outside
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setTransition(true);
    const timeout = setTimeout(() => {
      setTransition(false);
    }, 400); // 0.4 seconds

    return () => clearTimeout(timeout);
  }, [currentSlide]);

  useEffect(() => {
    fetchPresInfo(presentationId)
      .then((presentation) => {
        // setSlideCount(slideCount);
        setShowEditTitleModal(false);
      })
      .catch((error) => {
        console.error('Error fetching presentations:', error);
      });
  }, [presentationId, slideCount]);

  useEffect(() => {
    const fetchSlideData = () => {
      const localPresentationData = JSON.parse(localStorage.getItem('store'));
      if (localPresentationData) {
        const presentationIndex = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
        if (presentationIndex !== -1 && localPresentationData.presentations[presentationIndex].slides[currentSlide]) {
          setSlideCount(localPresentationData.presentations[presentationIndex].slides.length);
          // console.log('Slide count after fetching:', slideCount);
          const slideData = localPresentationData.presentations[presentationIndex].slides[currentSlide];
          // console.log('Slide data:', slideData);

          const textObjects = slideData.text || [];
          const codeObjects = slideData.code || [];
          const imageObjects = slideData.images || [];
          const videoObjects = slideData.video || [];
          setPhotos(imageObjects);
          console.log('after set', photos);
          setTextBoxes(textObjects);
          setCodeSnippets(codeObjects);
          setVideos(videoObjects);
        }
      }
    };

    fetchSlideData();
  }, [currentSlide, slides, presentationId]);

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

  const togglePreviewMode = () => {
    const localPresentationData = JSON.parse(localStorage.getItem('store'));
    const presentationIndex = localPresentationData.presentations.findIndex(presentation => presentation.id === presentationId);
    const storedSlides = localPresentationData.presentations[presentationIndex].slides;
    setIsPreviewing(true);
    localStorage.setItem('thisPresentation', JSON.stringify(localPresentationData.presentations[presentationIndex]));

    if (storedSlides) {
      setSlides(storedSlides);
      console.log('preview', isPreviewing);

      const slidesData = JSON.stringify(storedSlides);

      const previewWindow = window.open('/PresentationPreview', '_blank');

      if (previewWindow) {
        previewWindow.onload = () => {
          previewWindow.postMessage(slidesData, window.location.origin);
        };
      } else {
        console.error('Failed to open the preview window.');
      }
    }
  };

  const toggleRearrange = () => {
    navigate('/SlideRearrangeScreen');
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      // This checks if the clicked element is outside of any text box
      if (selectedTextBox && !event.target.closest('.editable-text-box')) {
        setSelectedTextBox(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedTextBox]);

  return (
    <>
      <body style={themes[theme]} >
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{

          paddingTop: '1%',
          paddingBottom: '1%',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
          boxShadow: '0 4px 6px  rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          border: '1px solid gray'
        }}>
          <div className="container-fluid">
            <a className="navbar-brand" style={navbarBrandStyle} onClick={() => navigate('/')}>
              Presto Editing
            </a>
            {/* Toggler/collapsible Button */}
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" style={{ backgroundColor: 'gray' }}>
              <span className="navbar-toggler-icon"></span>
            </button>
            {/* Navbar links */}
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item" style={{ margin: '2px' }}>
                  <button style={navBarButtonStyle} className='btn btn-primary' onClick={toggleTheme}>Switch Theme</button>
              </li>
                <li className="nav-item" style={{ margin: '2px' }}>
                  <button type="button" className="btn btn-primary" style={navbarButtonStyle} onClick={() => navigate('/Dashboard/')}>
                    Back
                  </button>
                </li>
                <li className="nav-item" style={{ margin: '2px' }}>
                  <button type="button" className="btn btn-primary" style={navbarButtonStyle} onClick={() => toggleVersionHistory(true)}>
                    Version History
                  </button>
                </li>
                <li className="nav-item" style={{ margin: '2px' }}>
                  <button type="button" className="btn btn-primary" style={navbarButtonStyle} onClick={() => handleSaveButtonClick()}>
                    Save
                  </button>
                </li>
                <li className="nav-item" style={{ margin: '2px' }}>
                  <button type="button" className="btn btn-primary" style={navbarButtonStyle} onClick={() => togglePreviewMode()}>
                    Preview
                  </button>
                </li>
                <li className="nav-item" style={{ margin: '2px' }}>
                  <button type="button" className="btn btn-primary" style={navbarButtonStyle} onClick={() => toggleRearrange()}>
                    Rearrange Slides
                  </button>
                </li>
                <li className="nav-item" style={{ margin: '2px' }}>
                  <button type="button" className="btn btn-danger" style={navbarButtonStyle} onClick={() => setShowDeleteModal(true)}>
                    Delete Presentation
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Title Editing */}
        <div className="d-flex justify-content-between bg-clear p-3">

          <h3 style={{ fontSize: '2.5em', marginLeft: '5%' }}>{title}</h3>
          <div style={{ marginRight: '5%' }}>
            <button className="btn btn-warning btn-sm me-2" onClick={() => setShowEditTitleModal(true)}>
              <img src="/images/pencil.png" alt="Edit" style={{ width: '35px', height: '35px', aspectRatio: '2 / 1', borderRadius: '10px', padding: '5px' }} />
            </button>
            <button className="btn btn-warning btn-sm me-2" onClick={addNewSlide}>
              <img src="/images/newslide.png" alt="Edit" style={{ width: '35px', height: '35px', aspectRatio: '2 / 1', borderRadius: '10px', padding: '5px' }} />
            </button>
          </div>
        </div>

        {/* Slide Num Box */}
        <div
          style={{
            ...slideViewerContainerStyle,
            ...renderBackground(),
          }} >
          {renderTextBoxes()}
          {renderCodeSnippets()}
          {renderPhotos()}
          {renderVideos()}
          <div className="container-fluid p-0" style={{ flex: 1 }}>
            <div style={slideNumberStyle}>
              {currentSlide + 1}
            </div>
          </div>
        </div>

        {/* Slides Navigation */}
        <div className="mt-3 ms-auto" style={editButtonStyle}>
          <button className="btn btn-dark btn-sm me-2" onClick={() => setShowTextEditModal(true)}>
            <img src="/images/text.png" alt="Text" style={{ width: '45px', height: '45px', aspectRatio: '2 / 1', borderRadius: '10px', padding: '5px', filter: 'invert(100%)' }} />
          </button>
          <button className="btn btn-dark btn-sm me-2" onClick={() => setShowCodeEditModal(true)}>
            <img src="/images/code.png" alt="Code" style={{ width: '45px', height: '45px', aspectRatio: '2 / 1', borderRadius: '10px', padding: '5px', filter: 'invert(100%)' }} />
          </button>
          <button className="btn btn-dark btn-sm me-2" onClick={() => setShowPhotoEditModal(true)}>
            <img src="/images/photo.png" alt="Photo" style={{ width: '45px', height: '45px', borderRadius: '10px', padding: '3px', filter: 'invert(100%)' }} />
          </button>
          <button className="btn btn-dark btn-sm me-2" onClick={() => setShowVideoEditModal(true)}>
            <img src="/images/videoup.png" alt="Video" style={{ width: '45px', height: '45px', aspectRatio: '2 / 1', borderRadius: '10px', padding: '3px' }} />
          </button>
          <button className="btn btn-dark btn-sm me-2" onClick={() => setShowBackgroundEditModal(true)} >
            <img src="/images/theme.png" alt="Theme" style={{ width: '45px', height: '45px', aspectRatio: '2 / 1', borderRadius: '10px', padding: '3px', filter: 'invert(50%)' }} />
          </button>

            {currentSlide > 0 && (
              <button className="btn btn-secondary btn-sm me-1" style={{ width: '45px', height: '45px', borderRadius: '10px', padding: '3px', alignContent: 'center', justifyContent: 'center', fontSize: '24px' }} onClick={handlePreviousSlide}>
                &lt;
              </button>
            )}
            {currentSlide < slideCount - 1 && (
              <button className="btn btn-secondary btn-sm me-1" style={{ width: '45px', height: '45px', borderRadius: '10px', padding: '3px', alignContent: 'center', justifyContent: 'center', fontSize: '24px' }} onClick={handleNextSlide}>
                &gt;
              </button>
            )}
          <button type="button" className="btn btn-danger me-2" style={PermBtnStyle} onClick={() => setShowDeleteSlideModal(true)}>
            Delete Slide
          </button>

        </div>

        {/* Edit Title Modal */}
        {showEditTitleModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Title</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditTitleModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                      <label htmlFor="editTitle" className="form-label">Presentation Title</label>
                      <input
                        type="text"
                        className="form-control"
                        id="editTitle"
                        placeholder="Enter new title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="d-flex justify-content-between p-3">
                      <button type="button" className="btn btn-warning" onClick={() => setShowEditTitleModal(false)}>Cancel</button>
                      <button type="button" className="btn btn-primary" onClick={handleTitleChangeConfirm(presentationId, title)}>Confirm</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div
            className="modal d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <h5 className="mb-3">Are you sure you want to delete your presentation:</h5>
                  <p className="mb-4" style={AlertStyle}><strong>{title}</strong></p>
                  <p className="text-secondary">This is an irreversible action.</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteConfirm}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Slide Modal */}
        {showDeleteSlideModal && (
          <div
            className="modal d-block"
            tabIndex="-1"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteSlideModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <h5 className="mb-3">Are you sure you want to delete your slide?</h5>
                  <p className="text-secondary">This is an irreversible action.</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteSlideModal(false)}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteSlide}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Text Modal */}
        {showTextEditModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Slide Text</h5>
                  <button type="button" className="btn-close" onClick={() => setShowTextEditModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                      <label htmlFor="editText" className="form-label">Add some text:</label>
                      <textarea
                        className="form-control"
                        id="editText"
                        rows="4"
                        placeholder="Enter text here"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        style={{ fontFamily }}
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="textSizeInput" className="form-label">Text Size %</label>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        className="form-control"
                        id="textSizeInput"
                        placeholder="Enter size as a percentage (0-100)"
                        value={textSize}
                        onChange={(e) => setTextSize(e.target.value)}
                      />
                    </div>
                    <div className="row">
                      <div className="col">
                        <label htmlFor="imageX" className="form-label">X Coordinate</label>
                        <input
                          type="number"
                          className="form-control"
                          id="imageX"
                          placeholder="Enter X position (0-100)"
                          onChange={(e) => setTextX(e.target.value)}
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="imageY" className="form-label">Y Coordinate</label>
                        <input
                          type="number"
                          className="form-control"
                          id="imageY"
                          placeholder="Enter Y position (0-100)"
                          onChange={(e) => setTextY(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="textColorInput" className="form-label">Text Color (HEX code)</label>
                      <input
                        type="color"
                        className="form-control form-control-color"
                        id="textColorInput"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="fontFamilySelect" className="form-label">Font Family</label>
                      <select
                        className="form-select"
                        id="fontFamilySelect"
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                      >
                        <option value="Arial">Arial</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Tahoma">Tahoma</option>
                        <option value="Trebuchet MS">Trebuchet MS</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Garamond">Garamond</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Brush Script MT">Brush Script MT</option>
                      </select>
                    </div>
                    <div className="d-flex justify-content-between p-3">
                      <button type="button" className="btn btn-warning" onClick={() => setShowTextEditModal(false)}>Cancel</button>
                      <button type="button" className="btn btn-primary" onClick={handleTextSubmit}>Confirm</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Code Modal */}
        {showCodeEditModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Code to Your Slide</h5>
                  <p className="text-secondary">Currently Accepted Languages: C, Python, & Javascript.</p>
                  <button type="button" className="btn-close" onClick={() => setShowCodeEditModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                      <label htmlFor="codeInput" className="form-label">Add some code:</label>
                      <textarea
                        className="form-control"
                        id="codeInput"
                        rows="4"
                        placeholder="Enter your code here"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="row">
                      <div className="col">
                        <label htmlFor="imageX" className="form-label">X Coordinate</label>
                        <input
                          type="number"
                          className="form-control"
                          id="imageX"
                          placeholder="Enter X position (0-100)"
                          onChange={(e) => setCodeX(e.target.value)}
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="imageY" className="form-label">Y Coordinate</label>
                        <input
                          type="number"
                          className="form-control"
                          id="imageY"
                          placeholder="Enter Y position (0-100)"
                          onChange={(e) => setCodeY(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="languageSelect" className="form-label">Select Language</label>
                      <select
                        className="form-select"
                        id="languageSelect"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      >
                        <option value="C">C</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Python">Python</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="fontSizeInput" className="form-label">Code Size (% of Container)</label>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        className="form-control"
                        id="fontSizeInput"
                        placeholder="50"
                        value={codeFontSize}
                        onChange={(e) => setCodeFontSize(e.target.value)}
                      />
                    </div>
                    <div className="d-flex justify-content-between p-3">
                      <button type="button" className="btn btn-warning" onClick={() => setShowCodeEditModal(false)}>Cancel</button>
                      <button type="button" className="btn btn-primary" onClick={handleCodeSubmit}>Confirm</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Photo Modal */}

        {showPhotoEditModal && (

          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add a Photo to Your Slide</h5>
                  <button type="button" className="btn-close" onClick={() => setShowPhotoEditModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                      <label htmlFor="imageSize" className="form-label">Image Size %</label>
                      <input
                        type="number"
                        className="form-control"
                        id="imageSize"
                        placeholder="Enter size (e.g., 50 for 50%)"
                        value={imageSize}
                        onChange={(e) => setImageSize(e.target.value)}
                      />
                      <small className="form-text text-muted" style={{ fontStyle: 'italic' }}>
                        Please set size before uploading the image.
                      </small>
                    </div>
                    <div className="row">
                      <div className="col">
                        <label htmlFor="imageX" className="form-label">X Coordinate</label>
                        <input
                          type="number"
                          className="form-control"
                          id="imageX"
                          placeholder="Enter X position (0-100)"
                          onChange={(e) => setPhotoX(e.target.value)}
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="imageY" className="form-label">Y Coordinate</label>
                        <input
                          type="number"
                          className="form-control"
                          id="imageY"
                          placeholder="Enter Y position (0-100)"
                          onChange={(e) => setPhotoY(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">Image URL or Base64</label>
                      <input
                        type="text"
                        className="form-control"
                        id="imageUrl"
                        placeholder="Enter image URL or Base64"
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="imageAlt" className="form-label">Image Description (alt tag)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="imageAlt"
                        placeholder="Enter image description"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="photoUpload" className="form-label">Or upload a photo</label>
                      <input
                        type="file"
                        className="form-control"
                        id="photoUpload"
                        accept="image/*"
                        onChange={handleFileChange}
                      // onChange={(e) => setImageFile(e.target.value)}
                      />
                    </div>
                    <div className="d-flex justify-content-between p-3">
                      <button type="button" className="btn btn-warning" onClick={() => setShowPhotoEditModal(false)}>Cancel</button>
                      <button type="button" className="btn btn-primary" onClick={() => handlePhotoConfirm()}>Confirm</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Video Modal */}
        {showVideoEditModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Embed a Video</h5>
                  <button type="button" className="btn-close" onClick={() => setShowVideoEditModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                      <label htmlFor="videoSize" className="form-label">Video Size (as percentage of slide)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="videoSize"
                        placeholder="Enter size (0 - 100)"
                        value={videoSize}
                        onChange={(e) => setVideoSize(e.target.value)}
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="row">
                      <div className="col">
                        <label htmlFor="imageX" className="form-label">X Coordinate</label>
                        <input
                          type="number"
                          className="form-control"
                          id="imageX"
                          placeholder="Enter X position (0-100)"
                          onChange={(e) => setVideoX(e.target.value)}
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="imageY" className="form-label">Y Coordinate</label>
                        <input
                          type="number"
                          className="form-control"
                          id="imageY"
                          placeholder="Enter Y position (0-100)"
                          onChange={(e) => setVideoY(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="videoUrl" className="form-label">YouTube Video URL</label>
                      <input
                        type="url"
                        className="form-control"
                        id="videoUrl"
                        placeholder="Enter YouTube URL"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                      />
                    </div>
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="videoAutoplay"
                        checked={videoAutoplay}
                        onChange={(e) => setVideoAutoplay(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="videoAutoplay">Autoplay Video</label>
                    </div>
                    <div className="d-flex justify-content-between p-3">
                      <button type="button" className="btn btn-warning" onClick={() => setShowVideoEditModal(false)}>Cancel</button>
                      <button type="button" className="btn btn-primary" onClick={handleVideoUpload}>Upload Video</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Video Modal */}
        {showEditingVideoModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Embed a Video</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditingVideoModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="mb-3">
                      <label htmlFor="videoSize" className="form-label">Video Size (as percentage of slide)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="videoSize"
                        placeholder="Enter size (0 - 100)"
                        value={videoSize}
                        onChange={(e) => setVideoSize(e.target.value)}
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="row">
                      <div className="col">
                        <label htmlFor="imageX" className="form-label">X Coordinate</label>
                        <input
                          type="number"
                          className="form-control"
                          id="imageX"
                          placeholder="Enter X position (0-100)"
                          onChange={(e) => setVideoX(e.target.value)}
                        />
                      </div>
                      <div className="col">
                        <label htmlFor="imageY" className="form-label">Y Coordinate</label>
                        <input
                          type="number"
                          className="form-control"
                          id="imageY"
                          placeholder="Enter Y position (0-100)"
                          onChange={(e) => setVideoY(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="videoAutoplay"
                        checked={videoAutoplay}
                        onChange={(e) => setVideoAutoplay(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="videoAutoplay">Autoplay Video</label>
                    </div>
                    <div className="d-flex justify-content-between p-3">
                      <button type="button" className="btn btn-warning" onClick={() => setShowEditingVideoModal(false)}>Cancel</button>
                      <button type="button" className="btn btn-primary" onClick={() => setShowEditingVideoModal(false)}>Confirm</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Backound Edit Modal */}
        {showBackgroundEditModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Slide Background</h5>
                  <button type="button" className="btn-close" onClick={() => setShowBackgroundEditModal(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={(e) => e.preventDefault()}>
                    {/* Color Selection */}
                    <div className="mb-3">
                      <label htmlFor="backgroundColor" className="form-label">Background Color (Solid)</label>
                      <input
                        type="color"
                        className="form-control form-control-color"
                        id="backgroundColor"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                      />
                    </div>

                    {/* Gradient Selection */}
                    <div className="mb-3">
                      <label htmlFor="backgroundGradient" className="form-label">Background Gradient</label>
                      <input
                        type="text"
                        className="form-control"
                        id="backgroundGradient"
                        placeholder="e.g., linear-gradient(to right, red, yellow)"
                        value={backgroundGradient}
                        onChange={(e) => setBackgroundGradient(e.target.value)}
                      />
                                    <div className="row">
                                      <div className="col">
                                      <small className="form-text text-muted" style={{ fontStyle: 'italic', fontSize: '.7em' }}>
                   For help on gradient format click
                    <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/linear-gradient" target="_blank" rel="noopener noreferrer"> here</a>.
                    </small>
                                      </div>
                                      <div className="col">
                                      <small className="form-text text-muted" style={{ fontStyle: 'italic', fontSize: '.7em' }}>
                    Create a custom gradient
                    <a href="https://mycolor.space/gradient" target="_blank" rel="noopener noreferrer"> here</a>.
                  </small>
                                      </div>
                                    </div>

                    </div>

                    {/* Gradient Direction */}
                    {/* <div className="mb-3">
                      <label htmlFor="gradientDirection" className="form-label">Gradient Direction</label>
                      <select className="form-select" id="gradientDirection" value={gradientDirection} onChange={(e) => setGradientDirection(e.target.value)}>
                        <option value="to right">Left to Right</option>
                        <option value="to bottom">Top to Bottom</option>
                        <option value="to bottom right">Top Left to Bottom Right</option>
                        <option value="to bottom left">Top Right to Bottom Left</option>
                      </select>
                    </div> */}

                    {/* Apply to Current Slide or All Slides */}
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="applyToAllSlides"
                          checked={applyToAllSlides}
                          onChange={(e) => setApplyToAllSlides(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="applyToAllSlides">
                          Apply to all slides
                        </label>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between p-3">
                      <button type="button" className="btn btn-warning" onClick={() => setShowBackgroundEditModal(false)}>Cancel</button>
                      <button type="button" className="btn btn-primary" onClick={handleBackgroundConfirm}>Confirm</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {showVersionHistory && (
          <div style={vhStyle}>
            <div className="d-flex justify-content-between align-items-center p-3">
              <h4>Version History</h4>
              <button style={{ margin: '1%' }}className="btn btn-secondary" onClick={() => setShowVersionHistory(false)}>Close</button>
            </div>
            <ul className="list-group list-group-flush">
              {versionHistory.map((version) => (
                <li className="list-group-item d-flex justify-content-between align-items-center" key={version.date}>
                  <span>{(version.date).toLocaleString()}</span>
                  <button className="btn btn-primary btn-sm" onClick={() => restoreVersion(version.present)}>Restore</button>
                </li>
              ))}
            </ul>
          </div>
        )}

      </body>
    </>
  );
};

export default EditPresentation;
