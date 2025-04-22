// app/components/VocabList.js
import VocabCard from "./VocabCard";

export default function VocabList({
  vocabList,
  handleDeleteVocab,
  playAudio,
}) {
  return (
    <>
      {vocabList.map((vocab) => (
        <VocabCard
          key={vocab.id}
          vocab={vocab}
          handleDeleteVocab={handleDeleteVocab}
          playAudio={playAudio}
        />
      ))}
    </>
  );
}
