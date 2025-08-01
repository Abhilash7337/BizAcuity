import { useState, useEffect } from 'react';

import { authFetch } from '../../../utils/auth';

export default function useDraftLoader({ draftId, isCollaborating, searchParams, setWallData, setDraftName, setLoading, setErrorMsg }) {
  useEffect(() => {
    const loadDraft = async () => {
      if (!draftId) return;
      try {
        setLoading(true);
        setErrorMsg('');
        const sharedParam = searchParams.get('shared');
        const isShared = sharedParam === 'true';
        const token = searchParams.get('token');
        const endpoint = isShared
          ? `${import.meta.env.VITE_API_BASE_URL}/drafts/shared/${draftId}${token ? `?token=${token}` : ''}`
          : `${import.meta.env.VITE_API_BASE_URL}/drafts/single/${draftId}`;
        const response = isShared
          ? await fetch(endpoint)
          : await authFetch(endpoint);
        if (!response.ok) throw new Error('Failed to load draft');
        const draft = await response.json();
        setDraftName(draft.name);
        const { wallData } = draft;
        if (wallData) setWallData(wallData);
        if (isCollaborating) {
          // Use a separate environment variable for WebSocket base URL, fallback to API base URL with ws protocol
          const wsBase = import.meta.env.VITE_WS_BASE_URL || import.meta.env.VITE_API_BASE_URL.replace(/^http/, 'ws');
          const ws = new window.WebSocket(`${wsBase}/drafts/${draftId}/collaborate`);
          ws.onmessage = (event) => {
            const update = JSON.parse(event.data);
            if (update.type === 'wall_update') {
              setWallData(update.wallData);
            }
          };
          return () => ws.close();
        }
      } catch (error) {
        setErrorMsg('Error loading draft or you do not have access.');
      } finally {
        setLoading(false);
      }
    };
    loadDraft();
    // eslint-disable-next-line
  }, [draftId, isCollaborating]);
}
