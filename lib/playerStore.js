// Player Data Store - In-Memory Database

const players = new Map();

class PlayerStore {
  createPlayer(userId, phone) {
    if (players.has(userId)) {
      return players.get(userId);
    }

    const player = {
      id: userId,
      phone: phone,
      role: null, // scientist, warrior, gatherer, leader
      roleKey: null,
      level: 1,
      experience: 0,
      points: 0,
      materials: {
        stone: 0,
        iron: 0,
        nitricAcid: 0,
        glass: 0,
      },
      questionsAnswered: 0,
      dailyStreak: 0,
      dailyDate: new Date().toDateString(),
      clanName: null,
      clanId: null,
      
      // Game States
      currentChallenge: null,
      currentRiddle: null,
      currentScramble: null,
      currentTrueFalse: null,
      currentLuckyQuestion: null,
      currentMath: null,
      currentMystery: null,
      currentBattle: null,
      currentTournament: null,
      
      // Cooldowns
      lastSpinWheel: 0,
      lastMystery: 0,
      lastExplore: 0,
      lastDice: 0,
      lastBattle: 0,
      lastTournament: 0,
      activeBet: null,
      
      // Progress
      storyProgress: 0,
      storyChapter: 1,
      unlockedAreas: [],
      
      // Timestamps
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    players.set(userId, player);
    return player;
  }

  getPlayer(userId) {
    return players.get(userId);
  }

  updatePlayer(userId, updates) {
    const player = players.get(userId);
    if (!player) return null;

    Object.assign(player, updates, { updatedAt: Date.now() });
    return player;
  }

  addPoints(userId, points, materials = {}) {
    const player = players.get(userId);
    if (!player) return null;

    player.points += points;
    player.experience += points;
    
    // Update level based on experience
    const thresholds = [0, 100, 300, 700, 1500];
    for (let i = 0; i < thresholds.length; i++) {
      if (player.experience >= thresholds[i]) {
        player.level = i + 1;
      }
    }

    // Add materials
    if (materials.stone) player.materials.stone += materials.stone;
    if (materials.iron) player.materials.iron += materials.iron;
    if (materials.nitricAcid) player.materials.nitricAcid += materials.nitricAcid;
    if (materials.glass) player.materials.glass += materials.glass;

    player.questionsAnswered += 1;
    return player;
  }

  getAllPlayers() {
    return Array.from(players.values());
  }

  getTopPlayers(limit = 10) {
    return Array.from(players.values())
      .sort((a, b) => b.points - a.points)
      .slice(0, limit);
  }

  deletePlayer(userId) {
    return players.delete(userId);
  }

  playerExists(userId) {
    return players.has(userId);
  }

  getPlayerStats(userId) {
    const player = players.get(userId);
    if (!player) return null;

    const roleNames = {
      scientist: '🧪 عالم',
      warrior: '⚔️ محارب',
      gatherer: '🌿 جامع',
      leader: '👑 قائد',
    };

    return {
      points: player.points,
      level: player.level,
      role: roleNames[player.role] || 'لم يختر دور',
      questionsAnswered: player.questionsAnswered,
      streak: player.dailyStreak,
      materials: player.materials,
      clan: player.clanName || 'بدون عشيرة',
      createdAt: new Date(player.createdAt).toLocaleDateString('ar-SA'),
    };
  }
}

export default new PlayerStore();
