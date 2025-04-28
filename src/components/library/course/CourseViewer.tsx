
import React, { useState } from 'react';
import { ContentItem } from '@/types/library';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CourseViewerProps {
  course: ContentItem;
  onProgress?: (progress: number) => void;
}

const CourseViewer: React.FC<CourseViewerProps> = ({ course, onProgress }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Simulação de estrutura de módulos para um curso
  const modules = [
    { 
      id: 1, 
      title: "Introdução", 
      lessons: [
        { id: 1, title: "Visão geral do curso", duration: "5:30", completed: true },
        { id: 2, title: "Como usar este curso", duration: "3:45", completed: false }
      ] 
    },
    { 
      id: 2, 
      title: "Fundamentos", 
      lessons: [
        { id: 3, title: "Conceitos básicos", duration: "10:15", completed: false },
        { id: 4, title: "Primeiros passos", duration: "8:20", completed: false }
      ] 
    },
  ];

  // Calcula o progresso geral com base nas lições concluídas
  const calculateProgress = () => {
    let totalLessons = 0;
    let completedLessons = 0;
    
    modules.forEach(module => {
      totalLessons += module.lessons.length;
      module.lessons.forEach(lesson => {
        if (lesson.completed) completedLessons++;
      });
    });
    
    const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    
    // Atualiza o progresso no componente pai
    if (onProgress) {
      onProgress(progress);
    }
    
    return progress;
  };

  // Calcula o progresso ao carregar o componente
  React.useEffect(() => {
    calculateProgress();
  }, []);

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="modules">Módulos</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Sobre este curso</h3>
            <p className="text-muted-foreground">{course.description}</p>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">O que você aprenderá</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Fundamentos e conceitos básicos</li>
                <li>Técnicas avançadas e práticas recomendadas</li>
                <li>Aplicação de conhecimentos em projetos reais</li>
                <li>Dicas e truques dos especialistas</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="modules">
            <div className="space-y-4">
              {modules.map(module => (
                <div key={module.id} className="border rounded-md p-4">
                  <h3 className="font-semibold">{module.title}</h3>
                  <div className="mt-2 space-y-2">
                    {module.lessons.map(lesson => (
                      <div key={lesson.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 ${lesson.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span>{lesson.title}</span>
                        </div>
                        <span className="text-muted-foreground">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <div className="space-y-4">
              <p>Materiais complementares para este curso:</p>
              <div className="space-y-2">
                <div className="flex items-center p-2 border rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Apostila do curso (PDF)</span>
                </div>
                <div className="flex items-center p-2 border rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Vídeos complementares</span>
                </div>
                <div className="flex items-center p-2 border rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Exercícios práticos</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CourseViewer;
