import * as storage from './localStorageHandler';

export const createEmptyKanjiStat = () => ({
  seen: 0,
  correct: 0,
  incorrect: 0,
  lastSeen: null,
});

export const getAllStats = () => {
  return storage.loadStats();
};

export const getStatForKanji = (uid) => {
  const stats = storage.loadStats();
  return stats[uid] ?? createEmptyKanjiStat();
};

export const recordSeen = (uid) => {
  const stats = storage.loadStats();

  stats[uid] = {
    ...(stats[uid] ?? createEmptyKanjiStat()),
    seen: (stats[uid]?.seen ?? 0) + 1,
    lastSeen: new Date().toISOString(),
  };

  storage.saveStats(stats);
};

export const recordResult = (uid, isCorrect) => {
  const stats = storage.loadStats();
  const current = stats[uid] ?? createEmptyKanjiStat();

  stats[uid] = {
    ...current,
    seen: current.seen + 1,
    correct: current.correct + (isCorrect ? 1 : 0),
    incorrect: current.incorrect + (!isCorrect ? 1 : 0),
    lastSeen: new Date().toISOString(),
  };

  storage.saveStats(stats);
};
