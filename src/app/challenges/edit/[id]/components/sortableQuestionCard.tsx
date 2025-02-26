import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrashIcon } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  question: string;
  type: string;
  icon?: string;
  answers: Answer[];
  isRequired?: boolean;
  isAlreadyExists?: boolean;
}

export interface SortableQuestionCardProps {
  questionItem: Question;
  handleToggleCorrect: (questionId: number, answerIndex: number) => void;
  handleRemoveOption: (questionId: number, answerIndex: number) => void;
  handleAddOption: (questionId: number) => void;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  questions: Question[];
  isRequired: boolean;
  setIsRequired: (value: boolean) => void;
}

export function SortableQuestionCard({
  questionItem,
  handleToggleCorrect,
  handleRemoveOption,
  handleAddOption,
  setQuestions,
  questions,
  isRequired,
  setIsRequired,
}: SortableQuestionCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: questionItem.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={`${isDragging ? "opacity-50" : ""}`}>
      <Card className="mb-4">
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value={`item-${questionItem.id}`}>
              <AccordionTrigger>
                <div className="flex w-full items-center gap-4">
                  <div
                    className="flex size-8 cursor-move items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200"
                    {...attributes}
                    {...listeners}
                  >
                    ⋮⋮
                  </div>
                  <div className="flex size-8 items-center justify-center rounded-md bg-purple-100">📝</div>
                  <div className="flex-1">
                    <h3 className="text-left font-medium">{questionItem.question || "Untitled Question"}</h3>
                    <p className="text-left text-sm text-gray-500">{questionItem.type}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="mb-2 block font-medium">Question</label>
                    <Input
                      value={questionItem.question}
                      onChange={(e) => {
                        setQuestions(
                          questions.map((q) => (q.id === questionItem.id ? { ...q, question: e.target.value } : q)),
                        );
                      }}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-medium">Answers</label>
                    <div className="space-y-2">
                      {questionItem.answers.map((answer, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={answer.isCorrect ? "text-green-600" : "text-gray-400"}
                            onClick={() => handleToggleCorrect(questionItem.id, index)}
                          >
                            {answer.isCorrect ? "✓" : "×"}
                          </Button>
                          <Input
                            value={answer.text}
                            onChange={(e) => {
                              setQuestions(
                                questions.map((q) => {
                                  if (q.id === questionItem.id) {
                                    const newAnswers = [...q.answers];
                                    newAnswers[index] = {
                                      ...newAnswers[index],
                                      text: e.target.value,
                                    };
                                    return { ...q, answers: newAnswers };
                                  }
                                  return q;
                                }),
                              );
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveOption(questionItem.id, index)}
                          >
                            ❌
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="mt-2 w-full" onClick={() => handleAddOption(questionItem.id)}>
                      Add Option +
                    </Button>
                  </div>

                  <div className="flex items-center justify-between border-t pt-4">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setQuestions(questions.filter((q) => q.id !== questionItem.id));
                      }}
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={questionItem.isRequired}
                        onCheckedChange={(e) => {
                          setQuestions(questions.map((q) => (q.id === questionItem.id ? { ...q, isRequired: e } : q)));
                        }}
                      />
                      <span>Required</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
