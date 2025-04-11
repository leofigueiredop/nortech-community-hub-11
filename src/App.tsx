
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import Library from './pages/Library';
import Events from './pages/Events';
import PointsDashboard from './pages/PointsDashboard';
import PointsStore from './pages/PointsStore';
import ContentCreatorDashboard from './pages/ContentCreatorDashboard';
import ContentManagement from './pages/ContentManagement';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ContentCreatorDashboard />,
  },
  {
    path: "/library",
    element: <Library />,
  },
  {
    path: "/events",
    element: <Events />,
  },
  {
    path: "/points",
    element: <PointsDashboard />,
  },
  {
    path: "/points/store",
    element: <PointsStore />,
  },
  {
    path: "/content-creator",
    element: <ContentCreatorDashboard />,
  },
  {
    path: "/content-management",
    element: <ContentManagement />
  },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
