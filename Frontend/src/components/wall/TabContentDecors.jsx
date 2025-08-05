import React from 'react';
import { DecorsPanel } from '../sidebar';

export default function TabContentDecors({ userDecors, handleAddDecor, handleRemoveUserDecor, handleSelectUserDecor, selectedIdx, setSelectedIdx, setActiveTab, userPlanAllowedDecors }) {
  return (
    <DecorsPanel
      onAddDecor={handleAddDecor}
      userDecors={userDecors}
      onRemoveUserDecor={handleRemoveUserDecor}
      onSelectUserDecor={handleSelectUserDecor}
      selectedIdx={selectedIdx}
      setSelectedIdx={setSelectedIdx}
      setActiveTab={setActiveTab}
      userPlanAllowedDecors={userPlanAllowedDecors}
    />
  );
}
