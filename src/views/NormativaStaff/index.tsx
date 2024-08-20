import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import StaffNormativeModal from './NormativaStaffModal';
import api from '../../utils/axios';
import { addNotification } from '../../redux/ui';
import { FaEdit } from 'react-icons/fa'; // Nueva importación

const StaffNormativePage: React.FC = () => {
  const [staffNormative, setStaffNormative] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStaffNormative = async () => {
      try {
        const response = await api.get('/config/staff-normative');
        setStaffNormative(response.data);
      } catch (error) {
        dispatch(addNotification({ message: 'Error al cargar la normativa del staff', color: 'danger' }));
      }
    };
    fetchStaffNormative();
  }, [dispatch]);

  return (
    <>
      {(userRole === 'super_admin') && (
        <div className="d-flex justify-content-end mt-5" style={{ marginInline: 20 }}>
          <FaEdit
            size={24}
            onClick={() => setShowEditModal(true)}
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: staffNormative || 'Cargando...' }} />
      {showEditModal && staffNormative && (
        <StaffNormativeModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          currentNormative={staffNormative}
          setStaffNormative={setStaffNormative}
        />
      )}
    </>
  );
};

export default StaffNormativePage;
