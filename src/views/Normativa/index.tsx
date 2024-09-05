import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import NormativaModal from './NormativaModal';
import api from '../../utils/axios';
import { addNotification } from '../../redux/ui';
import { UserRole, HtmlCssContent } from '../../utils/types';
import HtmlCssRenderer from '../../components/HtmlCssRenderer';

const NormativaPage: React.FC = () => {
  const [generalNormative, setGeneralNormative] = useState<HtmlCssContent | null>(null);
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
      {userRole === UserRole.SUPER_ADMIN && (
        <div className="edit-icon-container position-fixed" style={{ top: '100px', right: '50px' }}>
          <FaEdit
            size={24}
            onClick={() => setShowEditModal(true)}
            style={{ cursor: 'pointer', zIndex:100 }}
          />
        </div>
      )}
      <HtmlCssRenderer content={generalNormative} />

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
