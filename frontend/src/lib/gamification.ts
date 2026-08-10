export interface LevelInfo {
  level: number
  title: string
  currentXp: number
  xpForCurrentLevel: number
  xpForNextLevel: number
  progressToNext: number
}

const LEVELS = [
  { xp: 0, title: 'Aprendiz' },
  { xp: 100, title: 'Estagiário' },
  { xp: 300, title: 'Júnior' },
  { xp: 600, title: 'Pleno' },
  { xp: 1000, title: 'Sênior' },
  { xp: 1500, title: 'Especialista' },
] as const

export function getLevelInfo(xp: number): LevelInfo {
  let level = 1
  let title: string = LEVELS[0].title
  let xpForCurrentLevel = 0
  let xpForNextLevel: number = LEVELS[1]?.xp ?? LEVELS[0].xp + 500

  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) {
      level = i + 1
      title = LEVELS[i].title
      xpForCurrentLevel = LEVELS[i].xp
      xpForNextLevel = LEVELS[i + 1]?.xp ?? LEVELS[i].xp + 500
      break
    }
  }

  const range = xpForNextLevel - xpForCurrentLevel
  const progressToNext = range > 0 ? Math.min(100, ((xp - xpForCurrentLevel) / range) * 100) : 100

  return {
    level,
    title,
    currentXp: xp,
    xpForCurrentLevel,
    xpForNextLevel,
    progressToNext,
  }
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return 'Comece hoje e mantenha sua sequência!'
  if (streak === 1) return 'Ótimo começo! Volte amanhã para continuar.'
  if (streak < 7) return `${streak} dias seguidos — você está criando o hábito!`
  if (streak < 30) return `${streak} dias! Sua disciplina está impressionante.`
  return `${streak} dias de fogo! Você é imparável.`
}
