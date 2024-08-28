import React, { useRef } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
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
  let iconIndex = 0;

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
    <div className="d-flex align-items-center my-4 position-relative">
      <Button
        variant="outline-primary"
        onClick={() => handleScroll('left')}
        style={{
          borderRadius: '50%',
          position: 'absolute',
          left: '10px',
          zIndex: 2,
          width: '40px',
          height: '40px',
        }}
      >
        <FaChevronLeft />
      </Button>

      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          paddingLeft: '60px',
          paddingRight: '60px',
          width: '100%',
          scrollbarWidth: 'none',
        }}
        className="no-scrollbar"
      >
        <Row style={{ flexWrap: 'nowrap' }}>
          {events.length > 0 ? (
            events.map((event) => {
              const IconComponent = iconList[iconIndex % iconList.length];
              iconIndex++;
              return (
                <Col key={event.id} xs={4} md={3} style={{ padding: '0 10px' }}>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => handleEventClick(event.id as number | null)}
                  >
                    <IconComponent
                      size={82}
                      style={{ marginBottom: '10px' }}
                    />
                    <Card
                      className='card-events-home'
                      style={{ minWidth: '100%', marginBottom: '10px' }}
                    >
                      <Card.Body className="d-flex flex-column align-items-center" style={{ padding: 5 }}>
                        <Card.Title>{event.title}</Card.Title>
                        <Card.Text style={{ fontSize: 12 }}>
                          {new Date(event.startDate).toLocaleDateString()} - {new Date(event.startDate).toLocaleTimeString()}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              );
            })
          ) : (
            <p>No hay eventos recurrentes</p>
          )}
        </Row>
      </div>
      <Button
        variant="outline-primary"
        onClick={() => handleScroll('right')}
        style={{
          borderRadius: '50%',
          position: 'absolute',
          right: '10px',
          zIndex: 2,
          width: '40px',
          height: '40px',
        }}
      >
        <FaChevronRight />
      </Button>
    </div>
  );
};

export default ScrollableEvents;
