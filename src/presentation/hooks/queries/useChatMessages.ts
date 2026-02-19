import { MessageMapper } from "@/src/infrastructure/mappers/MessageMapper";
import { SupabaseChatRepository } from "@/src/infrastructure/repositories/SupabaseChatRepository";
import { supabase } from "@/src/infrastructure/supabase";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const chatRepo = new SupabaseChatRepository();

export const useChatMessages = (conversationId: string, userId: string) => {
    const queryClient = useQueryClient();

    const query = useInfiniteQuery({
        queryKey: ["messages", conversationId],
        queryFn: ({ pageParam = 0 }) =>
            chatRepo.getMessages(
                conversationId,
                pageParam as number,
                20,
                userId,
            ),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === 20 ? allPages.length : undefined,
        initialPageParam: 0,
    });

    useEffect(() => {
        if (!conversationId) return;

        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversationId}`,
                },
                async (payload) => {
                    const { data: userData } = await supabase
                        .from("users")
                        .select(
                            "id, firstname, lastname, image_profile, avatar_updated_at, contract",
                        )
                        .eq("id", payload.new.sender_id)
                        .single();

                    const newMessage = MessageMapper.toDomain(
                        { ...payload.new, users: userData },
                        userId,
                    );

                    queryClient.setQueryData(
                        ["messages", conversationId],
                        (oldData: any) => {
                            if (!oldData) return oldData;
                            return {
                                ...oldData,
                                pages: [
                                    [newMessage, ...oldData.pages[0]],
                                    ...oldData.pages.slice(1),
                                ],
                            };
                        },
                    );
                },
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, userId, queryClient]);

    return query;
};
