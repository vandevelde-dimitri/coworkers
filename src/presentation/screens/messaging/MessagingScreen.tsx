import { ScreenWrapper } from "@/src/presentation/components/ui/ScreenWrapper";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { ConversationItem } from "../../components/ui/ConversationItem";
import { Pagination } from "../../components/ui/molecules/pagination/Pagination";
import { useMessageStatus } from "../../hooks/context/messageContext";
import { useGetConversations } from "../../hooks/queries/useGetConversation";

const PAGE_SIZE = 5;

export default function MessagingScreen() {
  const { data: conversation, isLoading } = useGetConversations();
  const { unreadConversations } = useMessageStatus();
  const router = useRouter();
  const [page, setPage] = useState(1);

  const totalCount = conversation?.length ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const paginatedConversations = useMemo(() => {
    if (!conversation) return [];
    const start = (page - 1) * PAGE_SIZE;
    return conversation.slice(start, start + PAGE_SIZE);
  }, [conversation, page]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <ConversationItem
        item={item}
        unread={!!unreadConversations[item.id]}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/messaging/[id]",
            params: { id: item.id },
          })
        }
      />
    ),
    [unreadConversations, router],
  );

  if (isLoading) {
    return (
      <ScreenWrapper title="Conversation" showBackButton={false}>
        <Text>Chargement...</Text>
      </ScreenWrapper>
    );
  }

  if (totalCount === 0) {
    return (
      <ScreenWrapper title="Conversation" showBackButton={false}>
        <Text>Aucune conversation pour le moment.</Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper title="Conversation" showBackButton={false}>
      <FlatList
        data={paginatedConversations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={
          totalPages > 1 ? (
            <Pagination
              activeIndex={page - 1}
              totalItems={totalPages}
              onIndexChange={(i) => setPage(i + 1)}
              dotSize={10}
            />
          ) : null
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
  },
});
