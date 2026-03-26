import { ScreenWrapper } from "@/src/presentation/components/ui/ScreenWrapper";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ConversationItem } from "../../components/ui/ConversationItem";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { Pagination } from "../../components/ui/molecules/pagination/Pagination";
import ConversationItemSkeleton from "../../components/ui/skeleton/ConversationItemSkeleton";
import { useMessageStatus } from "../../hooks/context/messageContext";
import { useGetConversations } from "../../hooks/queries/useGetConversation";
import { useProtectedNavigation } from "../../hooks/useProtectedNavigation";

const PAGE_SIZE = 5;

export default function MessagingScreen() {
  const {
    data: conversation,
    isLoading,
    isError,
    refetch,
  } = useGetConversations();
  const { unreadConversations } = useMessageStatus();
  const router = useRouter();
  const { navigateSafely } = useProtectedNavigation();

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
        <View style={{ padding: 20 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <ConversationItemSkeleton key={i} />
          ))}
        </View>
      </ScreenWrapper>
    );
  }

  if (isError) {
    return (
      <ScreenWrapper title="Conversation" showBackButton={false}>
        <ErrorState onRetry={refetch} />
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
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            description="Veuillez participer à une annonce"
            title="Aucune conversation"
            onPress={() => navigateSafely("/(tabs)/home")}
            buttonLabel="Trouver une annonce"
          />
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 150,
    flexGrow: 1,
  },
});
