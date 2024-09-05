import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import AboutModal from './AboutModal';
import api from '../../utils/axios';
import { addNotification } from '../../redux/ui';
import { UserRole, HtmlCssContent } from '../../utils/types';
import HtmlCssRenderer from '../../components/HtmlCssRenderer';

const AboutPage: React.FC = () => {
  const [projectInfo, setProjectInfo] = useState<HtmlCssContent | null>(null);
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
      {(userRole === UserRole.SUPER_ADMIN) && (
        <div className="edit-icon-container position-fixed" style={{ top: '100px', right: '50px', zIndex:1000 }}>
          <FaEdit
            size={24}
            onClick={() => setShowEditModal(true)}
            style={{ cursor: 'pointer' }}
          />
        </div>
      )}
      <br />
      <HtmlCssRenderer content={projectInfo} />
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
