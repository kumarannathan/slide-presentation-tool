import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// const puppeteer = require('puppeteer');

// async function captureSlide() {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(`http://localhost:3000/${selectedSlide}`, {waitUntil: 'networkidle0'});
//     await page.screenshot({path: 'first-slide.png'});
//     await browser.close();
// }

const Dashboard = () => {
  const [presentations, setPresentations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPresentationName, setNewPresentationName] = useState('');
  const [slidesDescription, setSlidesDescription] = useState('');
  const presentationsContainerStyle = { display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px', margin: 'auto', justifyContent: 'center' };
  const presentationCardStyle = { backgroundColor: '#f0f0f0', color: '#333', flexBasis: 'calc(33% - 10px)', height: 'auto', aspectRatio: '2 / 1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '10px', padding: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)', flexShrink: '0', flexGrow: '1', minWidth: '100px', maxWidth: '300px' };
  const slideNameStyle = { fontWeight: 'bold', marginBottom: '10px' };
  const slidesDescStyle = { fontSize: 'smaller', color: '#666' }
  const navItemMargin = { margin: '5px' };
  const navBarButtonStyle = { margin: '1px' };
  const navigate = useNavigate();
  const [theme, setTheme] = useState('light');
  const themes = {
    light: {
      background: '#E0DDDD',
      minHeight: '100vh',
      color: '#333',
      paddingTop: '2%'
    },
    dark: {
      backgroundColor: 'black',
      minHeight: '100vh',
      color: 'white',
      paddingTop: '2%'
    }
  };
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (newPresentationName) {
      const defaultSlide = {
        id: 0,
        date: [],
        text: [],
        code: [],
        images: [],
        theme: [],
        video: [],
        background: 'white'
      };

      const newPresentation = {
        id: Math.random().toString(36).substring(7),
        name: newPresentationName,
        description: slidesDescription,
        slides: [{ defaultSlide }],
        versions: []
      };
      setPresentations([...presentations, newPresentation]);
      storePresentation(newPresentation, defaultSlide);
    }
    setShowModal(false);
  };

  function showAllPresentations (allPresentations) {
    if (Array.isArray(allPresentations)) {
      const formattedPresentations = allPresentations.map(presentation => ({
        id: presentation.id,
        name: presentation.name,
        description: presentation.description,
        background: presentation.background,
        slides: presentation.slides || [],
      }));
      setPresentations(formattedPresentations);
    }
  }

  function fetchPresentations () {
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
        console.log('Presentations data:', data.store.store.presentations);
        const allPresentations = data.store.store.presentations;
        showAllPresentations(allPresentations);
        return data;
      })
      .catch(error => {
        console.error('Error fetching presentations:', error);
        throw error;
      });
  }

  function storePresentation (newPresentation, newSlide) {
    const token = localStorage.getItem('token');
    const existingStoreData = JSON.parse(localStorage.getItem('store')) || { presentations: [] };
    const defaultSlide = newSlide;
    newPresentation.slides = [defaultSlide];
    existingStoreData.presentations.push(newPresentation);
    const payload = { store: existingStoreData };
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
          throw new Error('Failed to store presentation');
        }
        console.log('Presentation stored successfully:', newPresentation.name, newPresentation.description);
        localStorage.setItem('store', JSON.stringify(existingStoreData));
        return response.json();
      })
      .catch(error => {
        console.error('Error storing presentation:', error);
        throw error;
      });
  }

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('store');
    localStorage.removeItem('thisPresentation');
    alert('Logged out!');
    navigate('/login')
  }

  const goToEditPage = (presentationId) => {
    navigate(`/EditPresentation/${presentationId}`);
  };

  useEffect(() => {
    fetchPresentations();
  }, []);

  return (
<body style={themes[theme]}>
<div>
{/* Navbar */}
<div className="navbar navbar-expand-lg navbar-dark bg-dark" style={{
  marginTop: '-2.6%',
  border: '1px solid gray',
  paddingTop: '1%',
  paddingBottom: '1%',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'black',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
  marginLeft: '2px',
  marginRight: '2px'
}}>
<div className="container-fluid">
<a className="navbar-brand" style={{ color: 'white', fontSize: '1.5rem' }}>Presto</a>
<div className="ms-auto">
  <button style={navBarButtonStyle} className='btn btn-primary' onClick={toggleTheme}>Switch Theme</button>
  <button style={navBarButtonStyle} className='btn btn-primary' onClick={() => setShowModal(true)}>New Presentation</button>
  <button style={navBarButtonStyle} className='btn btn-warning' onClick={logOut}>Logout</button>
</div>
</div>
</div>

{/* create presentation modal */}
{showModal && (
<div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
<div className="modal-dialog">
<div className="modal-content">
<div className="modal-header">
<h5 className="modal-title">New Presentation</h5>
<button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
</div>
<div className="modal-body">
<form onSubmit={handleCreate}>
<div className="mb-3">
<label htmlFor="presentationName" className="form-label">Name Your Slideshow</label>
<input type="text" className="form-control" id="presentationName" placeholder="title" value={newPresentationName} onChange={(e) => setNewPresentationName(e.target.value)} />
</div>
<div className="mb-3">
<label htmlFor="slidesDescription" className="form-label">Slideshow Description</label>
<input type="text" className="form-control" id="slidesDescription" placeholder="description" value={slidesDescription} onChange={(e) => setSlidesDescription(e.target.value)} />
</div>
<button type="button" className="btn btn-secondary" style={navItemMargin} onClick={() => setShowModal(false)}>Cancel</button>
<button type="submit" className="btn btn-primary" style={navItemMargin} >Create</button>
</form>
</div>
</div>
</div>
</div>
)}

<div className="presentationsContainer" style={presentationsContainerStyle}>
  {presentations.map((presentation) => {
    const hasSlides = presentation.slides.length > 0;
    const firstSlideBackground = hasSlides && presentation.slides[0].background
      ? presentation.slides[0].background
      : 'lightgray'; // Default background color if not defined
    console.log(firstSlideBackground);
    const isGradient = firstSlideBackground.includes('gradient');

    const dynamicCardStyle = {
      ...presentationCardStyle,
      ...(isGradient ? { backgroundImage: firstSlideBackground } : { backgroundColor: firstSlideBackground }),
      position: 'relative',
      overflow: 'hidden'
    };

    return (
      <div key={presentation.id} className="presentationCard" style={dynamicCardStyle} onClick={() => goToEditPage(presentation.id, presentation.name)}>
        <div style={slideNameStyle}>{presentation.name}</div>
        <div style={slidesDescStyle}>{presentation.description}</div>
        <div style={slidesDescStyle}>Slides: {presentation.slides.length}</div>
      </div>
    );
  })}
</div>
</div>
</body>
  );
};

export default Dashboard;