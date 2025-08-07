import {ref} from 'vue'
import axios, {AxiosProgressEvent} from 'axios'
import {useErrorHandler} from "@/composables/useErrorHandler";
import {useSuccessHandler} from "@/composables/useSuccessHandler";
import {Conversation} from "@/models/Conversation";
import {Message} from "@/models/Message";

export function useChatsFunctions() {
    const sending = ref(false)
    const progress = ref(0)

    const getConversations = async (params: {
        per_page?: number,
        page?: number,
        source?: string
    }): Promise<{
        meta: { page: number; per_page: number, total: number };
        conversation: Conversation[]
    } | null> => {
        if (sending.value) return null

        sending.value = true
        progress.value = 0

        return await axios.get('conversations', {
            params: params
        })
            .then(res => {
                const result = res.data?.data
                return {
                    meta: {
                        page: result.current_page ?? 1,
                        per_page: result.per_page ?? 15,
                        total: result.total ?? 0
                    },
                    conversation: result.data.map((i: any) => Conversation.fromJSON(i))
                }
            })

            .catch(e => {
                sending.value = false
                useErrorHandler().showError(e)

                return null

            })
            .finally(() => sending.value = false)
    }

    // Получить подробную информацию о конкретном разговоре по его ID, включая сообщения и участников

    const getConversationById = async (conversationId: number | string,): Promise<
        Conversation
        | null> => {
        if (sending.value) return null

        sending.value = true
        progress.value = 0

        return await axios.get(`conversations/${conversationId}`)
            .then(res => {
                return Conversation.fromJSON(res.data.data)
            })

            .catch(e => {
                sending.value = false
                useErrorHandler().showError(e)

                return null

            })
            .finally(() => sending.value = false)
    }
    const conversationReplyById = async (
        conversationId: string | number,
        formData: {
            content: string,
            attachments: []
        }): Promise<
        Message
        | null> => {
        if (sending.value) return null

        sending.value = true
        progress.value = 0

        return await axios.post(`conversations/${conversationId}/reply`, formData)
            .then(res => {
                return Message.fromJSON(res.data.data)
            })

            .catch(e => {
                sending.value = false
                useErrorHandler().showError(e)

                return null

            })
            .finally(() => sending.value = false)
    }


    return {
        sending,
        progress,
        getConversations,
        getConversationById,
        conversationReplyById
    }
}
