import VocabCard from "./VocabCard";

export default function VocabList({
  vocabList,
  editingWordId,
  editingWord,
  startEditing,
  handleEditChange,
  handleEditSave,
  cancelEditing,
  handleDeleteVocab,
  playAudio,
}) {
  return (
    <>
      {vocabList.map((vocab) => (
        <VocabCard
          key={vocab.id}
          vocab={vocab}
          editing={editingWordId === vocab.id}
          editingWord={editingWord}
          startEditing={startEditing}
          handleEditChange={handleEditChange}
          handleEditSave={handleEditSave}
          cancelEditing={cancelEditing}
          handleDeleteVocab={handleDeleteVocab}
          playAudio={playAudio}
        />
      ))}
    </>
  );
}
