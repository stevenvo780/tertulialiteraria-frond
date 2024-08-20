import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa'; // Nueva importación
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import AboutModal from './AboutModal';
import api from '../../utils/axios';
import { addNotification } from '../../redux/ui';

const AboutPage: React.FC = () => {
  const [projectInfo, setProjectInfo] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const userRole = useSelector((state: RootState) => state.auth.userData?.role);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProjectInfo = async () => {
      try {
        const response = await api.get('/config/project-info');
        setProjectInfo(response.data);
      } catch (error) {
        dispatch(addNotification({ message: 'Error al cargar la información del proyecto', color: 'danger' }));
      }
    };

    fetchProjectInfo();
  }, [dispatch]);

  return (
    <>
      {userRole === 'super_admin' && (
        <div className="d-flex justify-content-end mt-5" style={{ marginInline: 20 }}>
          <FaEdit
            size={24}
            onClick={() => setShowEditModal(true)}
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}
      <br />
      <div dangerouslySetInnerHTML={{ __html: projectInfo || 'Cargando...' }} />
      {showEditModal && projectInfo && (
        <AboutModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          currentInfo={projectInfo}
          setProjectInfo={setProjectInfo}
        />
      )}
    </>
  );
};

export default AboutPage;
