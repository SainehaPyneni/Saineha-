export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  url: string;
}

export interface GameState {
  score: number;
  highScore: number;
  isPaused: boolean;
  isGameOver: boolean;
}
