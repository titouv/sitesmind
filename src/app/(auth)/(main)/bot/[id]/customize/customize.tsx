"use client";

import { Preview } from "@/app/(auth)/(main)/bot/[id]/customize/preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Resolver, useWatch, Controller } from "react-hook-form";
import { HexColorPicker } from "react-colorful";
import { useSupabase } from "@/supabase/components/supabase-provider";
import { useRouter } from "next/navigation";

const examplesValues = {
  startSentence:
    "Hello I'm the <insert compy name here> bot. How can I help you today?",
  contextSentence:
    "You are a bot trained on data from the <insert compy name here> website. You can answer questions about the company, its products, its services, etc. Your are suppose to be a good friend of the company.",
};

type FormValues = {
  startSentence: string;
  contextSentence: string;
  color: string;
};

export function Customize({ botId }: { botId: string }) {
  const { supabase, session } = useSupabase();

  async function updateBot(botId: string, data: FormValues) {
    const { data: bot, error } = await supabase
      .from("bots")
      .update({
        start_sentence: data.startSentence,
        context_sentence: data.contextSentence,
        color: data.color,
      })
      .match({ id: botId });
    if (error) {
      console.log(error);
    }
  }
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit = handleSubmit((data) => {
    console.log(data);
    updateBot(botId, data).then(async () => {
      // wait 1 second before redirecting
      await new Promise((r) => setTimeout(r, 10000));

      router.push(`/bot/${botId}/chat`);
    });
  });

  const realtimeFirstSentence = useWatch({
    control: control,
    name: "startSentence",
  });

  const realtimeColor = useWatch({
    control: control,
    name: "color",
  });

  return (
    <div className="grid grid-cols-2 gap-16">
      <form className="flex max-w-sm flex-col gap-8 pt-8" onSubmit={onSubmit}>
        <Label className="flex flex-col gap-2">
          Start sentence
          <Input
            {...register("startSentence")}
            placeholder={examplesValues.startSentence}
          />
        </Label>
        {errors?.startSentence && <p>{errors.startSentence.message}</p>}

        <Label className="flex flex-col gap-2">
          Context sentence
          <Textarea
            {...register("contextSentence")}
            placeholder={examplesValues.contextSentence}
            className="min-h-[100px]"
          />
          <span className="text-xs text-gray-500">
            This is the sentence that will be given to the AI bot to help it.
            You can give context on what the bot is about, on what it can do,
            etc.
          </span>
        </Label>

        <Label className="flex flex-col gap-2">
          Color
          <Controller
            name="color"
            control={control}
            render={({ field }) => <HexColorPicker {...field} />}
          />
        </Label>

        <Button type="submit">Submit</Button>
      </form>
      <div className="flex h-full flex-col  items-center justify-center">
        <Preview
          startSentence={
            !realtimeFirstSentence || realtimeFirstSentence == ""
              ? examplesValues.startSentence
              : realtimeFirstSentence
          }
          color={realtimeColor}
        />
      </div>
    </div>
  );
}
