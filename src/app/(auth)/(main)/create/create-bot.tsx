"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabase } from "@/supabase/components/supabase-provider";
import { useState } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useRouter } from "next/navigation";

const InputSchema = z
  .object({
    name: z.string().min(1).max(100),
  })
  .required();

type Inputs = z.infer<typeof InputSchema>;

export function CreateBot() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<Inputs>({
    resolver: zodResolver(InputSchema),
  });

  const { supabase, session } = useSupabase();
  const [supabaseError, setSupabaseError] = useState<string>();
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // wait 1 second before submitting
    if (!session) throw new Error("No session");
    createBot(data.name, session.user.id);
  };

  async function createBot(name: string, userId: string) {
    const { data: bot, error: botError } = await supabase
      .from("bots")
      .insert({ user_id: userId, name })
      .select()
      .single();

    if (botError) {
      throw botError;
      //   //   console.error(botError);
      //   setSupabaseError(botError.message);
      return;
    }
    console.log({ bot, botError });
    router.push(`/bot/${bot.id}`);
  }

  return (
    <>
      {!isSubmitting ? (
        <form
          className="flex flex-col gap-4 "
          onSubmit={handleSubmit(onSubmit)}
        >
          <Label>Name</Label>
          <Input placeholder="My custom bot" {...register("name")} />
          <span className="max-w-sm text-sm text-gray-500">
            Give a name to your bot, this will be used to identify it in the
            dashboard
          </span>
          <Button disabled={isSubmitting} type="submit">
            Create
          </Button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <LoadingSpinner />
          <span>Creating bot...</span>
        </div>
      )}
    </>
  );
}
