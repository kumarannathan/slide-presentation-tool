import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';

const RearrangeableGrid = () => {
  const initialCards = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    text: `Slide ${i + 1}`
  }));
  const navigate = useNavigate();
  const [cards, setCards] = useState(initialCards);

  const handleStop = (index, e, data) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      const card = newCards[index];
      card.x = data.x;
      card.y = data.y;
      return newCards;
    });
  };

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '10px',
    padding: '10px'
  };

  const cardStyle = {
    width: 'calc(100% - 10px)',
    paddingTop: 'calc(50% - 5px)',
    backgroundColor: '#f0f0f0',
    color: '#333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
        <body style={{ padding: '1%' }}>
            <div className="navbar navbar-expand-lg navbar-dark bg-dark" style={{
              marginTop: '1%',
              border: '1px solid gray',
              paddingTop: '1%',
              paddingBottom: '1%',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'black',
              boxShadow: '0 4px 6px  rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)',
              borderRadius: '10px',
              marginLeft: '2px',
              marginRight: '2px'
            }}>
                <div className="container-fluid">
                    <a className="navbar-brand" style={{ color: 'white', fontSize: '1.5rem' }}>Presto</a>
                    <div className="ms-auto">
                    <button className='btn btn-primary' onClick={() => navigate('/Dashboard/')}>Dashboard</button>
                    </div>
                </div>
            </div>
            <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
                <div style={gridContainerStyle}>
                    {cards.map((card, index) => (
                        <Draggable
                            key={card.id}
                            defaultPosition={{ x: 0, y: 0 }}
                            onStop={(e, data) => handleStop(index, e, data)}
                        >
                            <div style={cardStyle}>
                                {card.text}
                            </div>
                        </Draggable>
                    ))}
                </div>
            </div>
        </body>
  );
};

export default RearrangeableGrid;
