import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import NormativaModal from './NormativaModal';
import api from '../../utils/axios';
import { addNotification } from '../../redux/ui';

const NormativaPage: React.FC = () => {
  const [generalNormative, setGeneralNormative] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGeneralNormative = async () => {
      try {
        const response = await api.get('/config/general-normative');
        setGeneralNormative(response.data);
      } catch (error) {
        dispatch(addNotification({ message: 'Error al cargar la normativa general', color: 'danger' }));
      }
    };

    fetchGeneralNormative();
  }, [dispatch]);

  return (
    <>
      {(userRole === 'super_admin') && (
        <div className="text-center mt-5">
          <Button variant="primary" onClick={() => setShowEditModal(true)}>
            Editar Normativa General
          </Button>
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: generalNormative || 'Cargando...' }} />

      {showEditModal && generalNormative && (
        <NormativaModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          currentNormative={generalNormative}
          setGeneralNormative={setGeneralNormative}
        />
      )}
    </>
  );
};

export default NormativaPage;
