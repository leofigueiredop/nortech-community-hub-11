
import React, { useState } from 'react';
import { ContentItem, CourseModuleItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDuration } from '@/components/library/viewer/contentViewerUtils';
import { Search } from 'lucide-react';

interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

interface CourseTranscriptTabProps {
  course: ContentItem;
  currentLesson: CourseModuleItem | null;
  isDarkMode: boolean;
}

const CourseTranscriptTab: React.FC<CourseTranscriptTabProps> = ({
  course,
  currentLesson,
  isDarkMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(0); // In seconds
  
  // Mock transcript data
  const transcriptData: TranscriptSegment[] = [
    { start: 0, end: 10, text: "Welcome to this course on cryptocurrency and blockchain technology." },
    { start: 10, end: 20, text: "In this lesson, we'll explore the fundamental concepts behind blockchain." },
    { start: 20, end: 30, text: "A blockchain is a distributed, decentralized public ledger." },
    { start: 30, end: 40, text: "This means that the information is stored across multiple computers, not just one central server." },
    { start: 40, end: 50, text: "This decentralization provides several key advantages for security and transparency." },
    { start: 50, end: 60, text: "First, let's understand what a block actually is in this context." },
    { start: 60, end: 70, text: "A block contains data, the hash of the block, and the hash of the previous block." },
    { start: 70, end: 80, text: "This creates a chain of blocks, each referencing the one before it." },
    { start: 80, end: 90, text: "If someone tries to tamper with a block, all subsequent blocks would become invalid." },
    { start: 90, end: 100, text: "This is why blockchain is considered immutable and secure." },
    { start: 100, end: 110, text: "Cryptocurrencies like Bitcoin use blockchain to record all transactions." },
    { start: 110, end: 120, text: "These transactions are verified by network nodes through cryptography." },
    { start: 120, end: 130, text: "Once verified, a transaction can never be altered or deleted." },
    { start: 130, end: 140, text: "This permanent record creates transparency and trust in the system." },
    { start: 140, end: 150, text: "In the next section, we'll dive deeper into cryptographic hashing functions." },
    // Add more segments as needed
  ];
  
  // Filter transcript based on search
  const filteredTranscript = searchQuery
    ? transcriptData.filter(segment => 
        segment.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : transcriptData;
  
  // Handle click on transcript segment
  const handleSegmentClick = (start: number) => {
    // In a real app, this would seek the video to this position
    setCurrentTime(start);
    console.log(`Seek to ${formatDuration(start)}`);
  };
  
  // Check if a segment is the current one being played
  const isCurrentSegment = (segment: TranscriptSegment) => {
    return currentTime >= segment.start && currentTime < segment.end;
  };
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Transcript</h2>
      
      {/* Search box */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search transcript..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`pl-10 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}
        />
      </div>
      
      {/* Transcript content */}
      {currentLesson?.type !== 'video' ? (
        <div className="text-center py-6 text-muted-foreground">
          Transcript is only available for video lessons.
        </div>
      ) : filteredTranscript.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No transcript matches your search.
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {filteredTranscript.map((segment, index) => (
            <div
              key={index}
              onClick={() => handleSegmentClick(segment.start)}
              className={`p-3 rounded-md cursor-pointer border ${
                isCurrentSegment(segment)
                  ? 'bg-primary/10 border-primary/20'
                  : isDarkMode
                    ? 'hover:bg-slate-800 border-slate-700'
                    : 'hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex gap-3">
                <span className="text-sm font-medium text-muted-foreground min-w-[60px]">
                  {formatDuration(segment.start)}
                </span>
                <p>{segment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseTranscriptTab;
