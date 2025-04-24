
import React, { useState, useEffect } from 'react';
import { ContentItem, CourseModuleItem } from '@/types/library';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDuration } from '@/components/library/viewer/contentViewerUtils';
import { Check, Clock, Edit, Trash2, Plus } from 'lucide-react';

interface Note {
  id: string;
  lessonId: string;
  timestamp: number | null;
  content: string;
  createdAt: Date;
}

interface CourseNotesTabProps {
  course: ContentItem;
  currentLesson: CourseModuleItem | null;
  isDarkMode: boolean;
}

const CourseNotesTab: React.FC<CourseNotesTabProps> = ({
  course,
  currentLesson,
  isDarkMode
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  
  // Load mock notes
  useEffect(() => {
    // In a real app, this would fetch notes from backend
    const mockNotes: Note[] = [
      {
        id: '1',
        lessonId: currentLesson?.id || '',
        timestamp: 125,
        content: 'Important concept about blockchain technology and its applications.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
      },
      {
        id: '2',
        lessonId: currentLesson?.id || '',
        timestamp: 360,
        content: 'Remember to practice this technique with the provided examples.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
      }
    ];
    
    setNotes(mockNotes);
  }, [currentLesson?.id]);
  
  const addNote = () => {
    if (newNote.trim() === '') return;
    
    const note: Note = {
      id: Date.now().toString(),
      lessonId: currentLesson?.id || '',
      timestamp: 0, // Could be set to current video time
      content: newNote,
      createdAt: new Date()
    };
    
    setNotes(prev => [note, ...prev]);
    setNewNote('');
  };
  
  const startEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
  };
  
  const saveEdit = () => {
    if (editingNoteId) {
      setNotes(prev => prev.map(note => 
        note.id === editingNoteId 
          ? { ...note, content: editContent }
          : note
      ));
      setEditingNoteId(null);
    }
  };
  
  const cancelEdit = () => {
    setEditingNoteId(null);
  };
  
  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };
  
  const jumpToTimestamp = (timestamp: number | null) => {
    if (timestamp === null) return;
    
    // In a real app, this would jump to the timestamp in the video
    console.log(`Jump to ${formatDuration(timestamp)}`);
  };
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Your Notes</h2>
      
      {/* New Note Input */}
      <div className="mb-6">
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note..."
          className={`mb-3 resize-none ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}
          rows={3}
        />
        <Button 
          onClick={addNote} 
          disabled={newNote.trim() === ''}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>
      
      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          No notes yet. Add your first note above.
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div 
              key={note.id}
              className={`p-4 rounded-md ${
                isDarkMode ? 'bg-slate-800' : 'bg-slate-50'
              } border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}
            >
              {editingNoteId === note.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className={`resize-none ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}
                    rows={3}
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={saveEdit}
                      className="gap-1"
                    >
                      <Check className="h-3 w-3" />
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {note.timestamp !== null && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => jumpToTimestamp(note.timestamp)}
                          className="flex gap-1 items-center"
                        >
                          <Clock className="h-3 w-3" />
                          {formatDuration(note.timestamp)}
                        </Button>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => startEdit(note)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteNote(note.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="whitespace-pre-wrap">{note.content}</p>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseNotesTab;
