import {ref} from 'vue'
import axios, {AxiosProgressEvent} from 'axios'
import {useErrorHandler} from "@/composables/useErrorHandler";
import {useSuccessHandler} from "@/composables/useSuccessHandler";
import {Conversation} from "@/models/Conversation";
import {Message} from "@/models/Message";
import {PendingFile} from "@/types/chat";

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

    // Получить подробную информацию о конкретном разговоре
    const getConversationById = async (conversationId: number | string): Promise<
        Conversation
        | null
    > => {

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
        content: string,
        files?: PendingFile[]
    ): Promise<Message | null> => {
        if (sending.value) return null

        sending.value = true
        progress.value = 0

        try {
            // Если есть файлы - используем FormData
            if (files && files.length > 0) {
                const formData = new FormData()




                // Добавляем текст (может быть пустым если только файлы)
                const messageContent = content.trim()
                formData.append('content', messageContent)

                // Добавляем файлы
                files.forEach((pendingFile, index) => {
                    formData.append(`attachments[${index}]`, pendingFile.file)
                })

                // Отправляем FormData
                const response = await axios.post(
                    `conversations/${conversationId}/reply`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                            if (progressEvent.total) {
                                progress.value = Math.round(
                                    (progressEvent.loaded * 100) / progressEvent.total
                                )
                            }
                        }
                    }
                )

                return Message.fromJSON(response.data.data)
            }

            // Если нет файлов - отправляем JSON как раньше
            const response = await axios.post(
                `conversations/${conversationId}/reply`,
                {
                    content: content,
                    attachments: []
                }
            )

            return Message.fromJSON(response.data.data)

        } catch (e) {
            useErrorHandler().showError(e)
            return null
        } finally {
            sending.value = false
            progress.value = 0
        }
    }


    return {
        sending,
        progress,
        getConversations,
        getConversationById,
        conversationReplyById
    }
}
