import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Pagination, Container } from 'react-bootstrap';
import api from '../../utils/axios';
import { Events, Operators } from '../../utils/types';
import { addNotification } from '../../redux/ui';
import { useDispatch } from 'react-redux';

const EventsCRUD: React.FC = () => {
  const dispatch = useDispatch();
  const [events, setEvents] = useState<Events[]>([]);
  const [selectedDiscount, setSelectedDiscount] = useState<Events | null>(null);
  const [name, setName] = useState('');
  const [value, setValue] = useState(0);
  const [operator, setOperator] = useState(Operators.Percentage);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [EventsPerPage] = useState(5);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await api.get('/Events');
    setEvents(response.data);
  };

  const handleShowModal = (discount: Events | null = null) => {
    setSelectedDiscount(discount);
    setName(discount ? discount.name : '');
    setValue(discount ? discount.value : 0);
    setOperator(discount ? discount.operator : Operators.Percentage);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDiscount(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (selectedDiscount) {
        await api.patch(`/Events/${selectedDiscount.id}`, { name, value, operator });
      } else {
        await api.post('/Events', { name, value, operator });
      }
      dispatch(addNotification({ message: 'Se guardo correctamente', color: 'success' }));
      fetchEvents();
      handleCloseModal();
    } catch (error) {
      dispatch(addNotification({ message: 'Error al guardar', color: 'danger' }));
    }
  };

  const deleteDiscount = async (discount: Events) => {
    try {
      await api.delete(`/Events/${discount.id}`);
      dispatch(addNotification({ message: 'Se borro correctamente', color: 'success' }));
      fetchEvents();
    } catch (error) {
      dispatch(addNotification({ message: 'Error al borrar', color: 'danger' }));
    }
  };

  // Get current Events
  const indexOfLastDiscount = currentPage * EventsPerPage;
  const indexOfFirstDiscount = indexOfLastDiscount - EventsPerPage;
  const currentEvents = events.slice(indexOfFirstDiscount, indexOfLastDiscount);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  let active = currentPage;
  let items = [];
  for (let number = 1; number <= Math.ceil(events.length / EventsPerPage); number++) {
    items.push(
      <Pagination.Item key={number} active={number === active} onClick={() => paginate(number)}>
        {number}
      </Pagination.Item>,
    );
  }

  return (
    <Container fluid>
      <Button variant="outline-primary" onClick={() => handleShowModal()} style={{ margin: '10px' }}>Crear nuevo beneficio</Button>
      <Table bordered>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre del beneficio</th>
            <th>Valor</th>
            <th>Operador</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.map((discount: Events, index: number) => (
            <tr key={discount.id}>
              <td>{index + 1}</td>
              <td>{discount.name}</td>
              <td>{discount.value}</td>
              <td>{discount.operator}</td>
              <td width={"20%"}>
                <Button variant="outline-info" onClick={() => handleShowModal(discount)} style={{ margin: '5px' }}>Editar</Button>
                <Button variant="outline-danger" onClick={() => deleteDiscount(discount)} style={{ margin: '5px' }}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination style={{ margin: '10px' }}>{items}</Pagination>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedDiscount ? 'Actualizar' : 'Crear'} Beneficio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Nombre del beneficio</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Valor</Form.Label>
              <Form.Control type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Operador</Form.Label>
              <Form.Control as="select" value={operator} onChange={(e) => setOperator(e.target.value as Operators)}>
                <option value={Operators.Percentage}>{Operators.Percentage}</option>
                <option value={Operators.Subtraction}>{Operators.Subtraction}</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit} variant="outline-success" type="submit">
            {selectedDiscount ? 'Actualizar' : 'Crear'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EventsCRUD;
