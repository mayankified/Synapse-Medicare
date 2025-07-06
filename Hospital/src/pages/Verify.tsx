'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Conversation {
  id: number;
  userName: string;
  date: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
  }[];
  status: 'pending' | 'verified' | 'flagged';
}

export default function DoctorDashboard() {
  // Dummy conversation data (using Indian names and context)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      userName: 'Arjun Sharma',
      date: '2025-02-01',
      messages: [
        {
          role: 'user',
          content: 'Namaste Doctor, I have been experiencing severe headaches and a low-grade fever for 2 days.',
        },
        {
          role: 'assistant',
          content:
            'You should get adequate rest, drink plenty of fluids, and consider taking over-the-counter medication if approved by a physician. Please see a specialist if symptoms persist.',
        },
      ],
      status: 'pending',
    },
    {
      id: 2,
      userName: 'Neha Singh',
      date: '2025-02-02',
      messages: [
        {
          role: 'user',
          content: 'Doctor, I have had a persistent cough for a week. I’m worried it might be an infection.',
        },
        {
          role: 'assistant',
          content:
            'A persistent cough could indicate an underlying infection. I recommend consulting a pulmonologist if it does not improve in the next few days.',
        },
      ],
      status: 'pending',
    },
    {
      id: 3,
      userName: 'Rahul Patel',
      date: '2025-02-03',
      messages: [
        {
          role: 'user',
          content: 'I’m experiencing occasional chest congestion and trouble breathing at night.',
        },
        {
          role: 'assistant',
          content:
            'Try steam inhalation and monitor your symptoms. If your breathing difficulties worsen, please see a doctor. You may need a check-up to rule out asthma or other conditions.',
        },
      ],
      status: 'verified',
    },
  ]);

  // Update conversation status (verify/flag)
  const toggleStatus = (id: number, newStatus: 'flagged' | 'verified') => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id ? { ...conv, status: newStatus } : conv
      )
    );
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Review patient-chatbot interactions and verify or flag responses.
      </p>

      <div className="space-y-4">
        {conversations.map((conv) => (
          <ConversationCard
            key={conv.id}
            conversation={conv}
            onUpdateStatus={toggleStatus}
          />
        ))}
      </div>
    </div>
  );
}

interface ConversationCardProps {
  conversation: Conversation;
  onUpdateStatus: (id: number, newStatus: 'flagged' | 'verified') => void;
}

function ConversationCard({ conversation, onUpdateStatus }: ConversationCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleVerify = () => onUpdateStatus(conversation.id, 'verified');
  const handleFlag = () => onUpdateStatus(conversation.id, 'flagged');

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>
            {conversation.userName}
            {conversation.status === 'verified' && (
              <Badge variant="secondary" className="ml-2">
                Verified
              </Badge>
            )}
            {conversation.status === 'flagged' && (
              <Badge variant="destructive" className="ml-2">
                Flagged
              </Badge>
            )}
          </CardTitle>
          <CardDescription>{conversation.date}</CardDescription>
        </div>

        <div className="flex items-center gap-2">
          {conversation.status === 'pending' && (
            <Badge variant="outline">Pending Review</Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? (
              <>
                Hide
                <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                View
                <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <>
          <Separator />
          <CardContent>
            <div className="space-y-4">
              {conversation.messages.map((msg, index) => (
                <div
                  key={index}
                  className="rounded-md p-3 border flex flex-col"
                >
                  <span
                    className={`text-sm font-bold ${
                      msg.role === 'user'
                        ? 'text-blue-600'
                        : 'text-green-600'
                    }`}
                  >
                    {msg.role === 'user' ? 'Patient' : 'Chatbot'}
                  </span>
                  <span className="mt-1 text-sm text-muted-foreground">
                    {msg.content}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={handleVerify}
              disabled={conversation.status === 'verified'}
            >
              Verify
            </Button>
            <Button
              variant="destructive"
              onClick={handleFlag}
              disabled={conversation.status === 'flagged'}
            >
              Flag
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
