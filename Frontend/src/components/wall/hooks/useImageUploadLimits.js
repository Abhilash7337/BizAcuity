import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { authFetch } from '../../utils/auth';

export default function useImageUploadLimits() {
  const { registeredUser } = useContext(UserContext);
  const [imageUploadLimit, setImageUploadLimit] = useState(null);
  const [imageUploadPlan, setImageUploadPlan] = useState('');

  useEffect(() => {
    const fetchImageUploadLimits = async () => {
      try {
        if (!registeredUser?.isLoggedIn) {
          setImageUploadLimit(1);
          setImageUploadPlan('Guest');
          return;
        }
        const response = await authFetch('http://localhost:5001/drafts/image-upload-status');
        if (!response.ok) {
          setImageUploadLimit(1);
          setImageUploadPlan('Unknown');
          return;
        }
        const data = await response.json();
        setImageUploadLimit(data.allowedLimit);
        setImageUploadPlan(data.planName || 'Current Plan');
      } catch (error) {
        setImageUploadLimit(1);
        setImageUploadPlan('Unknown');
      }
    };
    fetchImageUploadLimits();
  }, [registeredUser]);

  return { imageUploadLimit, imageUploadPlan };
}
