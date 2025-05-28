import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Lock, Star, Rocket } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const PointsChallenges: React.FC = () => {
  // This is a coming soon feature, so we'll show a placeholder UI
  
  const comingSoonChallenges = [
    { 
      id: 'c1', 
      title: 'Complete the Foundations Course', 
      description: 'Finish all modules in the Foundations course',
      reward: 50,
      deadline: '7 days',
      difficulty: 'Easy',
    },
    { 
      id: 'c2', 
      title: 'Comment Streak', 
      description: 'Leave a comment on 5 different posts this week',
      reward: 30,
      deadline: '5 days',
      difficulty: 'Medium',
    },
    { 
      id: 'c3', 
      title: 'Knowledge Sharing', 
      description: 'Create your first post and get 3 likes',
      reward: 75,
      deadline: '7 days',
      difficulty: 'Hard',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Coming Soon Banner */}
      <Card className="border-2 border-dashed border-purple-300 dark:border-purple-800">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 3
              }}
              className="inline-block"
            >
              <Rocket className="h-16 w-16 text-purple-500 mx-auto" />
            </motion.div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">Challenges Coming Soon!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Weekly and monthly challenges will allow you to earn bonus points and exclusive rewards. 
                Stay tuned for the first wave of challenges!
              </p>
              <Badge className="mt-4 bg-purple-200 text-purple-800 hover:bg-purple-300 border-purple-300">
                Coming in Q2 2025
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Preview of Upcoming Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comingSoonChallenges.map(challenge => (
          <Card key={challenge.id} className="overflow-hidden relative">
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="bg-transparent border-amber-300 text-amber-600 dark:text-amber-400">
                {challenge.difficulty}
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-purple-500" />
                {challenge.title}
              </CardTitle>
              <CardDescription>{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: {challenge.deadline}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                  <Star className="h-4 w-4" />
                  <span>+{challenge.reward} pts</span>
                </div>
              </div>
              <Button disabled className="w-full bg-gray-200 hover:bg-gray-200 text-gray-600 cursor-not-allowed flex gap-2 items-center justify-center">
                <Lock className="h-4 w-4" />
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PointsChallenges; 