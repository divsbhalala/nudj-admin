import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useTeam } from "@/providers/team-provider";
import { challengesApi } from "@/services/challenge.service";

import { Challenge } from "../../../components/table";

import { SortableQuestionCard, Question } from "./sortableQuestionCard";

interface Action {
  icon: string;
  iconColor?: string;
  title: string;
  description: string;
  type: string;
}

const questionActions: Action[] = [
  {
    icon: "✓",
    iconColor: "text-green-600",
    title: "Correctly answer a question",
    description: "Ask a question with a predefined answer(s)",
    type: "multiple choice question",
  },
  {
    icon: "✏️",
    title: "Open-text question",
    description: "Ask an open text question to gather information",
    type: "open text question",
  },
  {
    icon: "📝",
    title: "Multiple Choice",
    description: "Allow the user to choose from a small set of different answers",
    type: "multiple choice question",
  },
  {
    icon: "⭐",
    title: "Rate your experience",
    description: "Ask the user to rate their experience with you",
    type: "rating",
  },
  {
    icon: "📋",
    title: "Select from a list",
    description: "Ask a question with a list of possible answers",
    type: "multiple choice question",
  },
];

const interactionActions: Action[] = [
  {
    icon: "🔗",
    title: "Visit an external link",
    description: "Have a user engage with a link to your content",
    type: "external link",
  },
  {
    icon: "📱",
    title: "Engage with content",
    description: "Provide content for users to engage with using text, photos or video",
    type: "content engagement",
  },
  {
    icon: "🖼️",
    title: "Upload an image",
    description: "Upload an image",
    type: "image upload",
  },
  {
    icon: "🔒",
    title: "Enter a secret access code",
    description: "Get users to enter a secret access code",
    type: "secret access code",
  },
  {
    icon: "📅",
    title: "Select a date",
    description: "Prompt users to select a date based on specific criteria",
    type: "date selection",
  },
];

const ActionsTab = ({ challenge }: { challenge: Challenge | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { activeTeam } = useTeam();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddOption = (questionId: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: [...q.answers, { text: "", isCorrect: false }],
          };
        }
        return q;
      }),
    );
  };

  const handleRemoveOption = (questionId: number, answerIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.filter((_, index) => index !== answerIndex),
          };
        }
        return q;
      }),
    );
  };

  const handleToggleCorrect = (questionId: number, answerIndex: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            answers: q.answers.map((answer, index) => ({
              ...answer,
              isCorrect: index === answerIndex,
            })),
          };
        }
        return q;
      }),
    );
  };

  const handleAddQuestion = (type: string, icon: string) => {
    const newQuestion: Question = {
      id: questions.length + 1,
      question: "",
      type: type,
      icon: icon,
      answers: type === "multiple choice question" ? [{ text: "", isCorrect: true }] : [],
    };
    setQuestions([...questions, newQuestion]);
    setIsOpen(false); // Close modal after adding
  };

  const handleAddAction = async () => {
    try {
      setIsSaving(true);
      const requests = questions.map(async (question, i) => {
        try {
          const options = question.answers.map((item, index) => ({
            id: `${item.text}_${index}`,
            label: item.text,
          }));

          const payload = {
            communityId: activeTeam?.id,
            allocationId: challenge?.id,
            allocatedTo: "challenge",
            category: "question",
            key: "question-multiple-choice",
            details: challenge?.details,
            attributes: {
              key: "question-multiple-choice",
              question: question.question,
              options: options,
              numberOfAnswersRequired: 1,
              correctAnswers: question.answers.filter((item) => item.isCorrect).map((item) => item.text),
            },
            config: {
              isOptional: !question.isRequired,
              socialValidation: "user-choice",
            },
          };

          let response;
          if (question.isAlreadyExists) {
            // Update existing action
            response = await challengesApi.updateAction(question.id.toString() || "", payload);
          } else {
            // Create new action
            response = await challengesApi.createAction(payload);
          }
          return response;
        } catch (error) {
          console.log("error: ", error);
        }
      });

      // Execute all API requests in parallel
      Promise.all(requests)
        .then((responses) => {
          console.log("All requests completed:", responses);
          toast({
            title: "Success",
            description: "All actions were created successfully",
            variant: "default",
          });
          router.push("/challenges");
        })
        .catch((error) => {
          console.error("Some requests failed:", error);
          toast({
            title: "Error",
            description: "Failed to create some actions",
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsSaving(false);
        });
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const transformApiToQuestion = (apiAction: any): Question => {
    console.log("apiAction: ", apiAction);
    return {
      id: apiAction.id,
      question: apiAction.attributes?.question,
      type: apiAction.key,
      answers: apiAction.attributes?.options?.map((option: any, index: number) => ({
        text: option.label,
        isCorrect: apiAction.attributes?.correctAnswers?.includes(option.label),
      })),
      isRequired: !apiAction.config?.isOptional,
      isAlreadyExists: true,
    };
  };

  const fetchActions = async () => {
    try {
      setIsLoading(true);
      const response: any = await challengesApi.fetchActions(challenge?.id || "", activeTeam?.id || "", 100, 0);
      if (response?.edges) {
        const transformedQuestions = response.edges
          ?.filter((action: any) => action.key === "question-multiple-choice")
          ?.map(transformApiToQuestion);
        setQuestions(transformedQuestions);
      }
    } catch (err) {
      console.error("Failed to fetch communities:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Design your challenge, your way.</h2>
        <Button onClick={() => setIsOpen(true)}>Add Action +</Button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
          {questions.map((questionItem) => (
            <SortableQuestionCard
              key={questionItem.id}
              questionItem={questionItem}
              handleToggleCorrect={handleToggleCorrect}
              handleRemoveOption={handleRemoveOption}
              handleAddOption={handleAddOption}
              setQuestions={setQuestions}
              questions={questions}
              isRequired={isRequired}
              setIsRequired={setIsRequired}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col">
          <div className="sticky top-0 z-10 mt-1 bg-white pb-4">
            <h3 className="text-lg font-semibold">Select an action to add</h3>
            <div className="relative mt-4">
              <Input placeholder="Search for actions" className="pl-8" />
              <span className="absolute left-2 top-2.5">🔍</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Question Section */}
              <div className="space-y-3">
                <h4 className="sticky top-0 bg-white py-2 font-medium">Question</h4>
                {questionActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-left"
                    onClick={() => handleAddQuestion(action.type, action.icon)}
                  >
                    <span className={`shrink-0 ${action.iconColor || ""}`}>{action.icon}</span>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{action.title}</div>
                      <div className="truncate text-sm text-gray-500">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Interaction Section */}
              <div className="space-y-3">
                <h4 className="sticky top-0 bg-white py-2 font-medium">Interaction</h4>
                {interactionActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start gap-3 text-left"
                    onClick={() => handleAddQuestion(action.type, action.icon)}
                  >
                    <span className="shrink-0">{action.icon}</span>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{action.title}</div>
                      <div className="truncate text-sm text-gray-500">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-6 flex justify-end" onClick={handleAddAction}>
        <Button disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</Button>
      </div>
      <Toast />
    </div>
  );
};

export default ActionsTab;
