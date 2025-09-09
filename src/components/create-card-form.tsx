"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Loader2 } from 'lucide-react';

import { generateCardSuggestions } from '@/ai/flows/generate-card-suggestions';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  frontText: z.string().min(1, 'Front text cannot be empty.'),
  backText: z.string().min(1, 'Back text cannot be empty.'),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCardFormProps {
  onAddCard: (frontText: string, backText: string) => void;
}

function AiAssistButton({
  field,
  form,
}: {
  field: 'frontText' | 'backText';
  form: any;
}) {
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { toast } = useToast();

  const handleGenerateSuggestion = async () => {
    const query = form.getValues(field);
    if (!query) {
      toast({
        title: 'Input needed',
        description: `Please type something in the "${
          field === 'frontText' ? 'Front' : 'Back'
        }" field first.`,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSuggestion('');
    try {
      const result = await generateCardSuggestions({ query });
      setSuggestion(result.suggestions);
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate suggestions. Please try again.',
        variant: 'destructive',
      });
      setPopoverOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppend = () => {
    const currentValue = form.getValues(field);
    form.setValue(field, `${currentValue}\n\n${suggestion}`);
    setPopoverOpen(false);
  };

  const handleReplace = () => {
    form.setValue(field, suggestion);
    setPopoverOpen(false);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute bottom-2 right-2 h-7 w-7 text-muted-foreground hover:text-accent-foreground"
          onClick={handleGenerateSuggestion}
        >
          <Sparkles className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">AI Suggestion</h4>
            <p className="text-sm text-muted-foreground">
              Use AI to augment your card content.
            </p>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            suggestion && (
              <div className="space-y-4">
                <p className="rounded-md border bg-muted p-2 text-sm">
                  {suggestion}
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleAppend}>
                    Append
                  </Button>
                  <Button size="sm" onClick={handleReplace}>
                    Replace
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function CreateCardForm({ onAddCard }: CreateCardFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frontText: '',
      backText: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = (values: FormValues) => {
    onAddCard(values.frontText, values.backText);
    form.reset();
    toast({
      title: 'Success!',
      description: 'Your new flashcard has been added to the deck.',
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="frontText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Front (Term)</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'Mitochondria'"
                          className="resize-none pr-10"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <AiAssistButton field="frontText" form={form} />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="backText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Back (Definition)</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'The powerhouse of the cell.'"
                          className="resize-none pr-10"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <AiAssistButton field="backText" form={form} />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Add Card</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
