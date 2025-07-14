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
        onDraftCreated={(newDraftId) => {
          // Update URL with new draft ID if one was created
          if (newDraftId && !draftId) {
            window.history.replaceState(null, '', `/wall?draftId=${newDraftId}&shared=true&collaborate=true`);
          }
          if (onDraftCreated) {
            onDraftCreated(newDraftId);
          }
        }}
      />
    </>
  );
};

export default WallModals; 