import React, { useRef } from 'react';
import { Button, Card } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { 
  FaBook, FaFeatherAlt, FaPenFancy, FaScroll, FaGlasses, FaUniversity, FaNewspaper 
} from 'react-icons/fa';
import { 
  GiBookshelf, GiBookmark, GiQuillInk, GiOpenBook, GiScrollUnfurled, GiBrain, GiSpellBook 
} from 'react-icons/gi';
import { 
  MdLibraryBooks, MdMenuBook, MdOutlineAutoStories, MdOutlineClass, MdOutlineSchool 
} from 'react-icons/md';
import { 
  IoBookSharp, IoSchoolSharp, IoJournal, IoNewspaperSharp 
} from 'react-icons/io5';
import { 
  BsBookHalf, BsBook, BsJournalBookmark, BsPen 
} from 'react-icons/bs';
import { 
  RiBookOpenLine, RiBookLine, RiArticleLine, RiPencilLine 
} from 'react-icons/ri';
import { Events } from '../utils/types';
import { useNavigate } from 'react-router-dom';

interface ScrollableEventsProps {
  events: Events[];
}

const iconList = [
  FaBook, FaFeatherAlt, FaPenFancy, FaScroll, FaGlasses, FaUniversity, FaNewspaper,
  GiBookshelf, GiBookmark, GiQuillInk, GiOpenBook, GiScrollUnfurled, GiBrain, GiSpellBook,
  MdLibraryBooks, MdMenuBook, MdOutlineAutoStories, MdOutlineClass, MdOutlineSchool,
  IoBookSharp, IoSchoolSharp, IoJournal, IoNewspaperSharp,
  BsBookHalf, BsBook, BsJournalBookmark, BsPen,
  RiBookOpenLine, RiBookLine, RiArticleLine, RiPencilLine
];

const ScrollableEvents: React.FC<ScrollableEventsProps> = ({ events }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  let iconIndex = 0; // Index to track the current icon

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  const handleEventClick = (eventId: number | null) => {
    if (eventId !== null) {
      navigate(`/events/${eventId}`);
    }
  };

  return (
    <div className="d-flex align-items-center my-4">
      <Button variant="outline-primary" onClick={() => handleScroll('left')} style={{ borderRadius: '50%' }}>
        <FaChevronLeft />
      </Button>
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          marginLeft: 20,
          marginRight: 20,
          width: '90%',
          scrollbarWidth: 'none',
        }}
        className="no-scrollbar"
      >
        {events.length > 0 ? (
          events.map((event) => {
            const IconComponent = iconList[iconIndex % iconList.length];
            iconIndex++;
            return (
              <div 
              key={event.id} 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => handleEventClick(event.id as number | null)}
              >
                <IconComponent 
                  size={82} 
                  style={{ 
                    background: 'linear-gradient(135deg, #DDB932, #B1801D)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '10px' 
                  }} 
                />
                <Card
                  className='card-events-home'
                  style={{ minWidth: '260px', marginRight: '10px' }}
                >
                  <Card.Body className="d-flex flex-column align-items-center" style={{padding: 5}}>
                    <Card.Title>{event.title}</Card.Title>
                    <Card.Text style={{ fontSize: 12 }}>
                      {new Date(event.startDate).toLocaleDateString()} - {new Date(event.startDate).toLocaleTimeString()}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            );
          })
        ) : (
          <p>No hay eventos recurrentes</p>
        )}
      </div>
      <Button variant="outline-primary" onClick={() => handleScroll('right')} style={{ borderRadius: '50%' }}>
        <FaChevronRight />
      </Button>
    </div>
  );
};

export default ScrollableEvents;
