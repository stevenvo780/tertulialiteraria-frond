import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Row, Col, Modal, Form, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../redux/ui';
import axios from '../../utils/axios';
import { FaEdit } from 'react-icons/fa';

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/user');
        setUsers(response.data);
      } catch (error) {
        dispatch(addNotification({ message: 'Error al cargar usuarios', color: 'danger' }));
      }
    };
    fetchUsers();
  }, [dispatch]);

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setRole(user.role);
    setShowModal(true);
  };

  const handleUpdateRole = async () => {
    setIsLoading(true);
    try {
      const response = await axios.patch(`/user/${selectedUser.id}`, { role });
      if (response.status === 200) {
        setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, role } : user)));
        dispatch(addNotification({ message: 'Rol actualizado correctamente', color: 'success' }));
      } else {
        dispatch(addNotification({ message: 'Error al actualizar el rol', color: 'danger' }));
      }
    } catch (error) {
      dispatch(addNotification({ message: 'Error al actualizar el rol', color: 'danger' }));
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h2 className="text-center mb-4">Lista de Usuarios</h2>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Correo</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.name || 'Sin nombre'}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button variant="secondary" size="sm" onClick={() => handleEditClick(user)}>
                      <FaEdit /> Editar Rol
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Rol</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUserRole">
              <Form.Label>Rol</Form.Label>
              <Form.Control
                as="select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">Usuario</option>
                <option value="editor">Editor</option>
                <option value="admin">Administrador</option>
                <option value="super_admin">Super Administrador</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleUpdateRole} disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Actualizar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserListPage;
