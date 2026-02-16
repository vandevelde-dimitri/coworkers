import { supabase } from "@/src/infrastructure/supabase";
import {
    Announcement,
    CreateAnnouncementPayload,
    UpdateAnnouncementPayload,
} from "../../domain/entities/announcement/Announcement";
import { BusinessError, UnauthorizedError } from "../../domain/errors/AppError";
import { IAnnouncementRepository } from "../../domain/repositories/AnnouncementRepository";
import { AnnouncementListMapper } from "../mappers/AnnouncementListMapper";
import { AnnouncementMapper } from "../mappers/AnnouncementMapper";

export class SupabaseAnnouncementRepository implements IAnnouncementRepository {
    private get baseSelect() {
        return `
            *,
            owner:users (
                id, firstname, image_profile, city, avatar_updated_at, contract,fc:fc_id (id, name),
                settings:settings!user_id (to_convey)
            ),
            participant_requests (
                id, status, user_id,
                users (
                    id, firstname, image_profile, city, avatar_updated_at, contract,
                    fc:fc_id (id, name),
                    settings:settings!user_id (to_convey)
                )
            )
        `;
    }

    async getAnnouncementById(id: string): Promise<Announcement | null> {
        const { data: annonce, error } = await supabase
            .from("annonces")
            .select(this.baseSelect)
            .eq("id", id)
            .maybeSingle();

        if (error) throw error;

        if (!annonce) return null;

        return AnnouncementMapper.toDomain(annonce);
    }

    async getAllAnnouncements(
        page: number,
        pageSize: number = 5,
        searchTerm: string,
        sortBy: string,
        fcId?: string | null,
    ): Promise<{ announcements: Announcement[]; totalCount: number }> {
        const cleanFcId = fcId === "all" ? null : fcId;
        const { data, error } = await supabase.rpc("get_annonces_for_user", {
            p_fc_id: cleanFcId,
            p_limit: pageSize,
            p_offset: (page - 1) * pageSize,
            p_search: searchTerm,
            p_sort_by: sortBy,
        });

        if (error) throw error;

        const announcements = (data || []).map((raw: any) =>
            AnnouncementListMapper.toDomain(raw),
        );

        const totalCount = data && data.length > 0 ? data[0].total_count : 0;

        return { announcements, totalCount };
    }
    async findOwnerAnnouncement(): Promise<Announcement | null> {
        const {
            data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) throw new UnauthorizedError();

        const { data: annonce, error } = await supabase
            .from("annonces")
            .select(this.baseSelect)
            .eq("user_id", authUser.id)
            .maybeSingle();

        if (error) throw error;
        return AnnouncementMapper.toDomain(annonce);
    }

    async createAnnouncement(
        payload: CreateAnnouncementPayload,
    ): Promise<Announcement> {
        const {
            data: { user: authUser },
        } = await supabase.auth.getUser();
        if (!authUser) throw new UnauthorizedError();

        const persistenceData = AnnouncementMapper.toPersistence(payload);

        const { data, error } = await supabase
            .from("annonces")
            .insert([{ ...persistenceData, user_id: authUser.id }])
            .select(
                `
        *,
        owner:users!user_id (*),
        participant_requests (*)
    `,
            )
            .single();

        if (error) {
            if (error.code === "23505") {
                throw new BusinessError(
                    "Vous avez déjà une annonce en cours. Supprimez-la avant d'en créer une nouvelle.",
                );
            }

            throw error;
        }
        return AnnouncementMapper.toDomain(data);
    }

    async updateConversationId(
        announcementId: string,
        conversationId: string,
    ): Promise<void> {
        const { error } = await supabase
            .from("annonces")
            .update({ conversation_id: conversationId })
            .eq("id", announcementId);
        if (error) throw error;
    }

    async updateAnnouncement(
        announcementId: string,
        data: UpdateAnnouncementPayload,
    ): Promise<void> {
        const persistenceData = AnnouncementMapper.toPersistence(data);

        const { error } = await supabase
            .from("annonces")
            .update(persistenceData)
            .eq("id", announcementId);

        if (error) throw error;
    }

    async deleteAnnouncement(announcementId: string): Promise<void> {
        const { error } = await supabase.rpc("delete_announcement", {
            p_annonce_id: announcementId,
        });

        if (error) throw error;
    }
}
