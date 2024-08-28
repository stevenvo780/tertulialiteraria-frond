import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { FaBook, FaFeatherAlt, FaGlasses, FaNewspaper, FaPenFancy, FaScroll, FaUniversity } from 'react-icons/fa';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css'; 
import { Events } from '../utils/types';
import { useNavigate } from 'react-router-dom';
import { BsBookHalf, BsBook, BsJournalBookmark, BsPen } from 'react-icons/bs';
import { GiBookshelf, GiBookmark, GiQuillInk, GiOpenBook, GiScrollUnfurled, GiBrain, GiSpellBook } from 'react-icons/gi';
import { MdLibraryBooks, MdMenuBook, MdOutlineAutoStories, MdOutlineClass, MdOutlineSchool } from 'react-icons/md';
import { IoBookSharp, IoSchoolSharp, IoJournal, IoNewspaperSharp } from 'react-icons/io5';
import { RiArticleLine, RiBookLine, RiBookOpenLine, RiPencilLine } from 'react-icons/ri';

const iconList = [
  FaBook, FaFeatherAlt, FaPenFancy, FaScroll, FaGlasses, FaUniversity, FaNewspaper,
  GiBookshelf, GiBookmark, GiQuillInk, GiOpenBook, GiScrollUnfurled, GiBrain, GiSpellBook,
  MdLibraryBooks, MdMenuBook, MdOutlineAutoStories, MdOutlineClass, MdOutlineSchool,
  IoBookSharp, IoSchoolSharp, IoJournal, IoNewspaperSharp,
  BsBookHalf, BsBook, BsJournalBookmark, BsPen,
  RiBookOpenLine, RiBookLine, RiArticleLine, RiPencilLine
];

interface ScrollableEventsProps {
  events: Events[];
}

const ScrollableEvents: React.FC<ScrollableEventsProps> = ({ events }) => {
  const navigate = useNavigate();
  let iconIndex = 0;

  const handleEventClick = (eventId: number | null) => {
    if (eventId !== null) {
      navigate(`/events/${eventId}`);
    }
  };

  return (
    <div className="d-flex align-items-center my-4 position-relative">
      <PerfectScrollbar
        style={{
          display: 'flex',
          overflowX: 'auto',
          paddingLeft: '60px',
          paddingRight: '60px',
          width: '100%',
        }}
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
                    <IconComponent size={82} style={{ marginBottom: '10px' }} />
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
      </PerfectScrollbar>
    </div>
  );
};

export default ScrollableEvents;
