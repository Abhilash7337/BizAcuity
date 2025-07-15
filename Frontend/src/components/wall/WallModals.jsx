import React from 'react';
import SaveDraftModal from '../shared/SaveDraftModal';
import ShareModal from '../shared/ShareModal';

const WallModals = ({
  showSaveModal,
  setShowSaveModal,
  showShareModal,
  setShowShareModal,
  wallRef,
  draftId,
  registeredUser,
  wallData,
  draftName,
  onDraftCreated
}) => {
  return (
    <>
      <SaveDraftModal
        showModal={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        wallRef={wallRef}
        draftId={draftId}
        registeredUser={registeredUser}
        wallData={wallData}
        initialDraftName={draftName}
      />

      <ShareModal
        showModal={showShareModal}
        onClose={() => setShowShareModal(false)}
        wallRef={wallRef}
        draftId={draftId}
        registeredUser={registeredUser}
        wallData={wallData}
        onDraftCreated={onDraftCreated} // Pass through the original function without override
      />
    </>
  );
};

export default WallModals; 