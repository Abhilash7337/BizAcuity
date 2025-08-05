import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../App';
import { authFetch } from '../../../utils/auth';

export default function useExportPermission() {
  const { registeredUser } = useContext(UserContext);
  const [canExport, setCanExport] = useState(true);

  useEffect(() => {
    const fetchExportPermission = async () => {
      if (!registeredUser?.isLoggedIn) {
        setCanExport(false);
        return;
      }
      try {
        const profileRes = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/user/profile`);
        if (!profileRes.ok) throw new Error('Failed to fetch user profile');
        const profile = await profileRes.json();
        if (!profile.plan) {
          setCanExport(false);
          return;
        }
        const plansRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/plans`);
        const plansData = await plansRes.json();
        let plans = plansData.plans || plansData;
        const userPlan = plans.find(p => p.name.toLowerCase() === profile.plan.toLowerCase());
        setCanExport(userPlan?.exportDrafts === true);
      } catch (err) {
        setCanExport(false);
      }
    };
    fetchExportPermission();
  }, [registeredUser]);

  return canExport;
}
