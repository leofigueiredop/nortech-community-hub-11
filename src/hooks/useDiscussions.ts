
import { useState, useCallback } from 'react';
import { usePoints } from '@/context/PointsContext';
import { useContentProgress } from '@/hooks/useContentProgress';
import { 
  Discussion, 
  DiscussionTopic, 
  DiscussionReply, 
  DiscussionFilter,
  DiscussionBadge,
  DiscussionUser,
  DiscussionComment
} from '@/types/discussion';

// Mock data for discussion topics
const TOPIC_CATEGORIES: DiscussionTopic[] = [
  {
    id: "renda-extra",
    title: "Renda Extra",
    name: "Renda Extra",
    description: "Discussões sobre formas de gerar renda extra e oportunidades financeiras",
    icon: "TrendingUp",
    discussionCount: 23,
    memberCount: 147,
    recentActivity: "1 hora atrás",
    slug: "renda-extra",
    community_id: "default",
    color: "#4CAF50",
    is_featured: true,
    is_private: false,
    access_level: "free",
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
    createdAt: "2024-01-15",
    createdBy: "admin"
  },
  {
    id: "networking",
    title: "Networking",
    name: "Networking",
    description: "Dicas e discussões sobre como expandir sua rede profissional e criar conexões valiosas",
    icon: "Users",
    discussionCount: 42,
    memberCount: 253,
    recentActivity: "30 minutos atrás",
    slug: "networking",
    community_id: "default",
    color: "#2196F3",
    is_featured: false,
    is_private: false,
    access_level: "free",
    created_at: "2024-01-20",
    updated_at: "2024-01-20",
    createdAt: "2024-01-20",
    createdBy: "admin"
  },
  {
    id: "perguntas-da-semana",
    title: "Perguntas da Semana",
    name: "Perguntas da Semana",
    description: "Questões relevantes e dúvidas frequentes desta semana na comunidade",
    icon: "Clock",
    discussionCount: 18,
    memberCount: 312,
    recentActivity: "2 horas atrás",
    slug: "perguntas-da-semana",
    community_id: "default",
    color: "#FF9800",
    is_featured: true,
    is_private: false,
    access_level: "free",
    created_at: "2024-02-01",
    updated_at: "2024-02-01",
    createdAt: "2024-02-01",
    createdBy: "admin"
  }
];

// Mock discussions for topics
const DISCUSSION_DATA: Record<string, Discussion[]> = {
  "renda-extra": [
    {
      id: "101",
      title: "Como iniciar com freelancing?",
      description: "Gostaria de dicas sobre como iniciar no mundo do freelancing como desenvolvedor",
      author: {
        id: "user1",
        name: "Juliana Mendes",
        avatar: "/placeholder.svg",
        level: 3,
        xp: 350
      },
      replies: 14,
      participants: 7,
      tags: ["Freelancing", "Desenvolvimento", "Iniciantes"],
      isHot: true,
      lastActivity: "1 hora atrás",
      created_at: "2024-03-15",
      updated_at: "2024-03-15",
      view_count: 45,
      upvotes: 8,
      format: "question",
      topic_id: "renda-extra",
      user_id: "user1",
      community_id: "default"
    },
    {
      id: "102",
      title: "Mercado financeiro para iniciantes",
      description: "Quais são os melhores caminhos para quem quer começar a investir com pouco dinheiro?",
      author: {
        id: "user2",
        name: "Rafael Costa",
        avatar: "/placeholder.svg",
        level: 2,
        xp: 180
      },
      replies: 23,
      participants: 9,
      tags: ["Investimentos", "Finanças", "Iniciantes"],
      isHot: false,
      lastActivity: "5 horas atrás",
      created_at: "2024-03-14", 
      updated_at: "2024-03-14",
      view_count: 67,
      upvotes: 12,
      format: "discussion",
      topic_id: "renda-extra",
      user_id: "user2",
      community_id: "default"
    }
  ],
  "networking": [
    {
      id: "201",
      title: "Eventos de networking em São Paulo",
      description: "Alguém conhece bons eventos para networking na área de tecnologia em São Paulo?",
      author: {
        id: "user3",
        name: "Carlos Almeida",
        avatar: "/placeholder.svg",
        level: 4,
        xp: 520
      },
      replies: 17,
      participants: 12,
      tags: ["Eventos", "São Paulo", "Tecnologia"],
      isHot: true,
      lastActivity: "2 horas atrás",
      created_at: "2024-03-16",
      updated_at: "2024-03-16",
      view_count: 89,
      upvotes: 15,
      format: "question",
      topic_id: "networking",
      user_id: "user3",
      community_id: "default"
    }
  ],
  "perguntas-da-semana": [
    {
      id: "301",
      title: "Como lidar com síndrome do impostor?",
      description: "Estou começando em uma nova empresa e sinto que não estou à altura do cargo. Como lidar?",
      author: {
        id: "user4",
        name: "Amanda Rocha",
        avatar: "/placeholder.svg",
        level: 5,
        xp: 780
      },
      replies: 42,
      participants: 18,
      tags: ["Psicologia", "Carreira", "Autoconfiança"],
      isHot: true,
      lastActivity: "3 horas atrás",
      created_at: "2024-03-13",
      updated_at: "2024-03-13",
      view_count: 156,
      upvotes: 32,
      isAnswered: true,
      format: "question",
      topic_id: "perguntas-da-semana",
      user_id: "user4",
      community_id: "default"
    }
  ]
};

// Mock discussion replies
const DISCUSSION_REPLIES: Record<string, DiscussionReply[]> = {
  "101": [
    {
      id: "reply1",
      content: "Comece criando um perfil forte em plataformas como Upwork e Workana. Destaque suas habilidades específicas e comece com preços competitivos para construir seu portfólio.",
      author: {
        id: "user5",
        name: "Pedro Silva",
        avatar: "/placeholder.svg",
        level: 7,
        xp: 1200
      },
      created_at: "2024-03-15 14:30",
      discussion_id: "101",
      user_id: "user5",
      upvotes: 5,
      is_answer: true,
      isAcceptedAnswer: true
    },
    {
      id: "reply2",
      content: "Além das plataformas, não subestime o poder do networking local. Participe de eventos da área e conecte-se com potenciais clientes.",
      author: {
        id: "user6",
        name: "Maria Oliveira",
        avatar: "/placeholder.svg",
        level: 4,
        xp: 450
      },
      created_at: "2024-03-15 15:45",
      discussion_id: "101",
      user_id: "user6",
      upvotes: 3,
      is_answer: false
    }
  ]
};

// Available badges for discussions
const AVAILABLE_BADGES: DiscussionBadge[] = [
  {
    id: "badge1",
    name: "Colaborador Iniciante",
    description: "Contribuiu com 5 discussões",
    category: "participation"
  },
  {
    id: "badge2",
    name: "Ajudante",
    description: "Teve 3 respostas marcadas como solução",
    category: "achievement"
  },
  {
    id: "badge3",
    name: "Especialista",
    description: "Recebeu mais de 50 upvotes em suas contribuições",
    category: "achievement"
  },
  {
    id: "badge4",
    name: "Moderador da Comunidade",
    description: "Ajuda a manter a comunidade organizada",
    category: "moderation"
  }
];

export const useDiscussions = () => {
  const [topics, setTopics] = useState<DiscussionTopic[]>(TOPIC_CATEGORIES);
  const [discussions, setDiscussions] = useState<Record<string, Discussion[]>>(DISCUSSION_DATA);
  const [replies, setReplies] = useState<Record<string, DiscussionReply[]>>(DISCUSSION_REPLIES);
  const [badges, setBadges] = useState<DiscussionBadge[]>(AVAILABLE_BADGES);
  const [activeFilters, setActiveFilters] = useState<DiscussionFilter[]>([]);
  const { awardPoints } = usePoints();

  // Get all topics
  const getAllTopics = useCallback(() => {
    return topics;
  }, [topics]);

  // Get a specific topic by ID
  const getTopic = useCallback((topicId: string) => {
    return topics.find(topic => topic.id === topicId);
  }, [topics]);

  // Get discussions for a topic
  const getDiscussions = useCallback((topicId: string) => {
    return discussions[topicId] || [];
  }, [discussions]);

  // Get a specific discussion by ID
  const getDiscussion = useCallback((discussionId: string) => {
    for (const topicId in discussions) {
      const discussion = discussions[topicId].find(d => d.id === discussionId);
      if (discussion) return discussion;
    }
    return null;
  }, [discussions]);

  // Get replies for a discussion
  const getReplies = useCallback((discussionId: string) => {
    return replies[discussionId] || [];
  }, [replies]);

  // Create a new discussion
  const createDiscussion = useCallback((topicId: string, discussion: Omit<Discussion, 'id' | 'created_at' | 'updated_at' | 'replies' | 'participants'>) => {
    const newDiscussion: Discussion = {
      ...discussion,
      id: `discussion-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      lastActivity: 'agora mesmo',
      replies: 0,
      participants: 1,
      view_count: 0,
      topic_id: topicId,
      community_id: "default"
    };

    setDiscussions(prev => ({
      ...prev,
      [topicId]: [...(prev[topicId] || []), newDiscussion]
    }));

    // Update topic discussion count
    setTopics(prev => prev.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          discussionCount: topic.discussionCount + 1,
          recentActivity: 'agora mesmo'
        };
      }
      return topic;
    }));

    // Award points for creating a discussion
    awardPoints({
      type: 'discussion_creation',
      description: `Criou uma discussão: ${discussion.title}`,
      points: 10
    });

    return newDiscussion;
  }, [setDiscussions, setTopics, awardPoints]);

  // Add a reply to a discussion
  const addReply = useCallback((discussionId: string, reply: Omit<DiscussionReply, 'id' | 'created_at' | 'upvotes'>) => {
    const newReply: DiscussionReply = {
      ...reply,
      id: `reply-${Date.now()}`,
      created_at: new Date().toISOString(),
      discussion_id: discussionId,
      user_id: reply.author?.id || 'anonymous',
      upvotes: 0,
      is_answer: false
    };

    setReplies(prev => ({
      ...prev,
      [discussionId]: [...(prev[discussionId] || []), newReply]
    }));

    // Update discussion metadata
    for (const topicId in discussions) {
      setDiscussions(prev => ({
        ...prev,
        [topicId]: prev[topicId].map(d => {
          if (d.id === discussionId) {
            const currentReplies = typeof d.replies === 'number' ? d.replies : 0;
            const currentParticipants = prev[topicId].find(disc => disc.id === discussionId)?.participants || 0;
            const newParticipantsCount = currentParticipants + 1;
            
            return {
              ...d,
              replies: currentReplies + 1,
              participants: newParticipantsCount,
              lastActivity: 'agora mesmo'
            };
          }
          return d;
        })
      }));
    }

    // Award points for replying
    awardPoints({
      type: 'discussion_reply',
      description: `Respondeu à discussão #${discussionId}`,
      points: 5
    });

    return newReply;
  }, [setReplies, discussions, setDiscussions, awardPoints]);

  // Fix for the error TS2365: Operator '+' cannot be applied to types 'number | DiscussionComment[]' and 'number'
  const addToReplies = (current: number | DiscussionComment[] | undefined, amount: number): number => {
    if (typeof current === 'number') {
      return current + amount;
    }
    if (Array.isArray(current)) {
      return current.length + amount;
    }
    return amount;
  };

  // Create a new topic
  const createTopic = useCallback((topic: Omit<DiscussionTopic, 'id' | 'discussionCount' | 'memberCount' | 'recentActivity' | 'createdAt' | 'slug'>) => {
    const newTopic: DiscussionTopic = {
      ...topic,
      id: `topic-${Date.now()}`,
      slug: topic.name!.toLowerCase().replace(/\s+/g, '-'),
      discussionCount: 0,
      memberCount: 1,
      recentActivity: 'agora mesmo',
      createdAt: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      community_id: "default"
    };

    setTopics(prev => [...prev, newTopic]);
    setDiscussions(prev => ({
      ...prev,
      [newTopic.id]: []
    }));

    // Award points for creating a topic
    awardPoints({
      type: 'topic_creation',
      description: `Criou o tópico: ${topic.name}`,
      points: 20
    });

    return newTopic;
  }, [setTopics, setDiscussions, awardPoints]);

  // Vote on a discussion
  const voteDiscussion = useCallback((discussionId: string, isUpvote: boolean) => {
    for (const topicId in discussions) {
      setDiscussions(prev => ({
        ...prev,
        [topicId]: prev[topicId].map(d => {
          if (d.id === discussionId) {
            return {
              ...d,
              upvotes: isUpvote ? (d.upvotes || 0) + 1 : (d.upvotes || 0),
              downvotes: !isUpvote ? (d.downvotes || 0) + 1 : (d.downvotes || 0)
            };
          }
          return d;
        })
      }));
    }

    // Award points for receiving an upvote
    if (isUpvote) {
      const discussion = getDiscussion(discussionId);
      if (discussion) {
        awardPoints({
          type: 'received_upvote',
          description: `Recebeu um upvote na discussão: ${discussion.title}`,
          points: 2
        });
      }
    }
  }, [discussions, setDiscussions, getDiscussion, awardPoints]);

  // Vote on a reply
  const voteReply = useCallback((discussionId: string, replyId: string, isUpvote: boolean) => {
    setReplies(prev => ({
      ...prev,
      [discussionId]: prev[discussionId].map(r => {
        if (r.id === replyId) {
          return {
            ...r,
            upvotes: isUpvote ? r.upvotes + 1 : r.upvotes
          };
        }
        return r;
      })
    }));

    // Award points for receiving an upvote on a reply
    if (isUpvote) {
      const reply = replies[discussionId]?.find(r => r.id === replyId);
      if (reply) {
        awardPoints({
          type: 'received_reply_upvote',
          description: 'Recebeu um upvote em uma resposta',
          points: 1
        });
      }
    }
  }, [replies, setReplies, awardPoints]);

  // Mark a reply as accepted answer
  const acceptAnswer = useCallback((discussionId: string, replyId: string) => {
    setReplies(prev => ({
      ...prev,
      [discussionId]: (prev[discussionId] || []).map(r => ({
        ...r,
        isAcceptedAnswer: r.id === replyId
      }))
    }));

    // Mark the discussion as answered
    for (const topicId in discussions) {
      setDiscussions(prev => ({
        ...prev,
        [topicId]: prev[topicId].map(d => {
          if (d.id === discussionId) {
            return {
              ...d,
              isAnswered: true
            };
          }
          return d;
        })
      }));
    }

    // Award points for having answer accepted
    const reply = replies[discussionId]?.find(r => r.id === replyId);
    if (reply) {
      awardPoints({
        type: 'answer_accepted',
        description: 'Sua resposta foi marcada como solução',
        points: 15
      });
    }
  }, [replies, setReplies, discussions, setDiscussions, awardPoints]);

  // Filter discussions
  const filterDiscussions = useCallback((topicId: string, filters: DiscussionFilter[]) => {
    setActiveFilters(filters);
    
    const topicDiscussions = discussions[topicId] || [];
    if (filters.length === 0) return topicDiscussions;

    return topicDiscussions.filter(discussion => {
      return filters.every(filter => {
        switch (filter.type) {
          case 'tag':
            return discussion.tags.includes(filter.value);
          case 'status':
            if (filter.value === 'hot') return discussion.isHot;
            if (filter.value === 'answered') return discussion.isAnswered;
            if (filter.value === 'unanswered') return !discussion.isAnswered;
            return true;
          case 'time':
            if (filter.value === 'today') return discussion.lastActivity.includes('hora') || discussion.lastActivity.includes('minuto');
            if (filter.value === 'week') return !discussion.lastActivity.includes('mês');
            return true;
          case 'format':
            return discussion.format === filter.value;
          default:
            return true;
        }
      });
    });
  }, [discussions, setActiveFilters]);

  // Get active users (most contributions)
  const getActiveUsers = useCallback(() => {
    const userContributions: Record<string, { user: DiscussionUser; count: number }> = {};
    
    // Count discussions created
    Object.values(discussions).flat().forEach(discussion => {
      const userId = discussion.author!.id;
      if (!userContributions[userId]) {
        userContributions[userId] = { user: discussion.author!, count: 0 };
      }
      userContributions[userId].count += 1;
    });
    
    // Count replies
    Object.values(replies).flat().forEach(reply => {
      const userId = reply.author!.id;
      if (!userContributions[userId]) {
        userContributions[userId] = { user: reply.author!, count: 0 };
      }
      userContributions[userId].count += 1;
    });
    
    return Object.values(userContributions)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [discussions, replies]);

  // Get trending tags (most used)
  const getTrendingTags = useCallback(() => {
    const tagCounts: Record<string, number> = {};
    
    Object.values(discussions).flat().forEach(discussion => {
      discussion.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count }));
  }, [discussions]);

  return {
    topics,
    discussions,
    replies,
    badges,
    activeFilters,
    getAllTopics,
    getTopic,
    getDiscussions,
    getDiscussion,
    getReplies,
    createDiscussion,
    addReply,
    createTopic,
    voteDiscussion,
    voteReply,
    acceptAnswer,
    filterDiscussions,
    getActiveUsers,
    getTrendingTags,
    addToReplies
  };
};
