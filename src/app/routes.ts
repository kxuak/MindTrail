import { createBrowserRouter } from 'react-router';
import { Layout } from '../components/Layout';
import { TrailPage } from '../pages/TrailPage';
import { RankingPage } from '../pages/RankingPage';
import { AIPage } from '../pages/AIPage';
import { EscapeRoomPage } from '../pages/EscapeRoomPage';
import { MentalHealthPage } from '../pages/MentalHealthPage';

export const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { index: true, Component: TrailPage },
      { path: 'ranking', Component: RankingPage },
      { path: 'ia', Component: AIPage },
      { path: 'escape', Component: EscapeRoomPage },
      { path: 'saude', Component: MentalHealthPage },
    ],
  },
]);
