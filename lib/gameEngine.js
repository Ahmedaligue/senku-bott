// Game Engine - Core Game Logic

import playerStore from './playerStore.js';
import gamesData from './gamesData.js';

class GameEngine {
  constructor() {
    this.activeBets = new Map();
    this.activeBattles = new Map();
    this.activeTournaments = new Map();
  }

  // Select Role
  selectRole(userId, roleKey) {
    const roles = {
      scientist: { name: '🧪 عالم', bonus: 1.5 },
      warrior: { name: '⚔️ محارب', bonus: 1.2 },
      gatherer: { name: '🌿 جامع', bonus: 1.1 },
      leader: { name: '👑 قائد', bonus: 1.3 },
    };

    if (!roles[roleKey]) return null;

    return playerStore.updatePlayer(userId, {
      role: roleKey,
      roleKey: roleKey,
    });
  }

  // Scientific Challenge
  getScientificChallenge() {
    const challenges = gamesData.scientificChallenges;
    return challenges[Math.floor(Math.random() * challenges.length)];
  }

  checkScientificAnswer(userId, challenge, answerIndex) {
    const player = playerStore.getPlayer(userId);
    const isCorrect = answerIndex === challenge.correct;

    if (isCorrect) {
      const points = challenge.points * (player.role === 'scientist' ? 1.5 : 1);
      const materials = { stone: Math.floor(points / 5) };
      playerStore.addPoints(userId, points, materials);
    }

    return {
      isCorrect,
      challenge,
      explanation: challenge.explanation,
      points: isCorrect ? challenge.points : 0,
    };
  }

  // Arabic Riddle
  getArabicRiddle() {
    const riddles = gamesData.arabicRiddles;
    return riddles[Math.floor(Math.random() * riddles.length)];
  }

  checkRiddleAnswer(userId, riddle, userAnswer) {
    const isCorrect = userAnswer.trim().toLowerCase() === riddle.answer.toLowerCase();
    const player = playerStore.getPlayer(userId);

    if (isCorrect) {
      playerStore.addPoints(userId, riddle.points);
    }

    return { isCorrect, riddle, points: isCorrect ? riddle.points : 0 };
  }

  // Scrambled Word
  getScrambledWord() {
    const words = gamesData.scrambledWords;
    return words[Math.floor(Math.random() * words.length)];
  }

  checkScrambledAnswer(userId, wordData, userAnswer) {
    const isCorrect = userAnswer.trim().toLowerCase() === wordData.word.toLowerCase();

    if (isCorrect) {
      playerStore.addPoints(userId, wordData.points);
    }

    return { isCorrect, word: wordData.word, points: isCorrect ? wordData.points : 0 };
  }

  // True/False Question
  getTrueFalseQuestion() {
    const questions = gamesData.trueFalseQuestions;
    return questions[Math.floor(Math.random() * questions.length)];
  }

  checkTrueFalseAnswer(userId, question, isTrue) {
    const correct = isTrue === question.isTrue;

    if (correct) {
      playerStore.addPoints(userId, question.points);
    }

    return {
      correct,
      question,
      explanation: question.explanation,
      points: correct ? question.points : 0,
    };
  }

  // Lucky Question (Random)
  getLuckyQuestion() {
    const allChallenges = gamesData.scientificChallenges;
    return allChallenges[Math.floor(Math.random() * allChallenges.length)];
  }

  // Math Challenge
  getMathProblem(difficulty = 'easy') {
    const problems = gamesData.mathProblems[difficulty];
    return problems[Math.floor(Math.random() * problems.length)];
  }

  checkMathAnswer(userId, problem, userAnswer) {
    const correct = userAnswer.trim() === problem.answer;

    if (correct) {
      playerStore.addPoints(userId, problem.points);
    }

    return { correct, problem, points: correct ? problem.points : 0 };
  }

  // Mystery Event
  getMysteryEvent() {
    const events = gamesData.mysteryEvents;
    return events[Math.floor(Math.random() * events.length)];
  }

  resolveMystery(userId, event, optionIndex) {
    const option = event.options[optionIndex];
    if (!option) return null;

    playerStore.addPoints(userId, option.points, option.materials);

    return {
      success: true,
      pointsEarned: option.points,
      materialsEarned: option.materials,
    };
  }

  // Exploration
  exploreArea(userId, areaIndex) {
    const areas = gamesData.mapAreas;
    const area = areas[areaIndex];

    if (!area) return null;

    const player = playerStore.getPlayer(userId);
    if (player.points < area.requiredPoints) {
      return { success: false, reason: 'notEnoughPoints' };
    }

    playerStore.addPoints(userId, area.rewards.points, area.rewards.materials);

    const updatedPlayer = playerStore.updatePlayer(userId, {
      unlockedAreas: [...(player.unlockedAreas || []), areaIndex],
    });

    return {
      success: true,
      area,
      rewards: area.rewards,
      player: updatedPlayer,
    };
  }

  // Dice Bet System
  placeDiceBet(userId, bet) {
    const player = playerStore.getPlayer(userId);
    if (player.points < bet.amount) {
      return { success: false, reason: 'insufficientPoints' };
    }

    const dice = Math.floor(Math.random() * 6) + 1;
    let won = false;

    if (bet.type === 'even' && dice % 2 === 0) won = true;
    if (bet.type === 'odd' && dice % 2 !== 0) won = true;
    if (bet.type === 'high' && dice > 3) won = true;
    if (bet.type === 'low' && dice <= 3) won = true;
    if (bet.type === 'number' && dice === bet.number) won = true;

    if (won) {
      const multipliers = { even: 2, odd: 2, high: 2, low: 2, number: 5 };
      const winnings = bet.amount * multipliers[bet.type];
      playerStore.updatePlayer(userId, { points: player.points + winnings });
    } else {
      playerStore.updatePlayer(userId, { points: player.points - bet.amount });
    }

    return { dice, won, bet };
  }

  // Clan System
  createClan(userId, clanName) {
    const player = playerStore.getPlayer(userId);
    if (player.clanName) {
      return { success: false, reason: 'alreadyInClan' };
    }

    playerStore.updatePlayer(userId, { clanName, clanId: Date.now() });
    return { success: true, clanName };
  }

  joinClan(userId, clanName) {
    const player = playerStore.getPlayer(userId);
    if (player.clanName) {
      return { success: false, reason: 'alreadyInClan' };
    }

    playerStore.updatePlayer(userId, { clanName });
    return { success: true, clanName };
  }

  // Get Joke
  getJoke() {
    const jokes = gamesData.jokes;
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // Get Quote
  getQuote() {
    const quotes = gamesData.quotes;
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
}

export default new GameEngine();
