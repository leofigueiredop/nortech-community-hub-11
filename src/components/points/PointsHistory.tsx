
import React from 'react';
import { PointsActivity, usePoints } from '@/context/PointsContext';

const PointsHistory: React.FC = () => {
  const { pointsHistory } = usePoints();
  
  if (pointsHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No points activity yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pointsHistory.map((entry, index) => (
        <div 
          key={entry.id || index} 
          className="flex justify-between items-center p-3 rounded-md border"
        >
          <div>
            <p className="font-medium">{entry.description}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(entry.timestamp).toLocaleString()}
            </p>
          </div>
          <div className={`font-bold ${entry.points >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {entry.points >= 0 ? '+' : ''}{entry.points}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PointsHistory;
