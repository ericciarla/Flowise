import { Request, Response, NextFunction } from 'express'
import { chatType } from '../../Interface'
import chatflowsService from '../../services/chatflows'
import chatMessagesService from '../../services/chat-messages'

const createChatMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.body === 'undefined' || req.body === '') {
            throw new Error('Error: chatMessagesController.createChatMessage - request body not provided!')
        }
        const apiResponse = await chatMessagesService.createChatMessage(req.body)
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const getAllChatMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let chatTypeFilter = req.query?.chatType as chatType | undefined
        if (chatTypeFilter) {
            try {
                const chatTypeFilterArray = JSON.parse(chatTypeFilter)
                if (chatTypeFilterArray.includes(chatType.EXTERNAL) && chatTypeFilterArray.includes(chatType.INTERNAL)) {
                    chatTypeFilter = undefined
                } else if (chatTypeFilterArray.includes(chatType.EXTERNAL)) {
                    chatTypeFilter = chatType.EXTERNAL
                } else if (chatTypeFilterArray.includes(chatType.INTERNAL)) {
                    chatTypeFilter = chatType.INTERNAL
                }
            } catch (e) {
                return res.status(500).send(e)
            }
        }
        const sortOrder = req.query?.order as string | undefined
        const chatId = req.query?.chatId as string | undefined
        const memoryType = req.query?.memoryType as string | undefined
        const sessionId = req.query?.sessionId as string | undefined
        const messageId = req.query?.messageId as string | undefined
        const startDate = req.query?.startDate as string | undefined
        const endDate = req.query?.endDate as string | undefined
        const feedback = req.query?.feedback as boolean | undefined
        if (typeof req.params.id === 'undefined' || req.params.id === '') {
            throw new Error(`Error: chatMessageController.getAllChatMessages - id not provided!`)
        }
        const apiResponse = await chatMessagesService.getAllChatMessages(
            req.params.id,
            chatTypeFilter,
            sortOrder,
            chatId,
            memoryType,
            sessionId,
            startDate,
            endDate,
            messageId,
            feedback
        )
        if (typeof apiResponse.executionError !== 'undefined') {
            return res.status(apiResponse.status).send(apiResponse.msg)
        }
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

const getAllInternalChatMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sortOrder = req.query?.order as string | undefined
        const chatId = req.query?.chatId as string | undefined
        const memoryType = req.query?.memoryType as string | undefined
        const sessionId = req.query?.sessionId as string | undefined
        const messageId = req.query?.messageId as string | undefined
        const startDate = req.query?.startDate as string | undefined
        const endDate = req.query?.endDate as string | undefined
        const feedback = req.query?.feedback as boolean | undefined
        const apiResponse = await chatMessagesService.getAllInternalChatMessages(
            req.params.id,
            chatType.INTERNAL,
            sortOrder,
            chatId,
            memoryType,
            sessionId,
            startDate,
            endDate,
            messageId,
            feedback
        )
        if (typeof apiResponse.executionError !== 'undefined') {
            return res.status(apiResponse.status).send(apiResponse.msg)
        }
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

//Delete all chatmessages from chatId
const removeAllChatMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (typeof req.params.id === 'undefined' || req.params.id === '') {
            throw new Error('Error: chatMessagesController.removeAllChatMessages - id not provided!')
        }
        const chatflowId = req.params.id
        const chatId = req.query?.chatId as string
        const chatType = req.query?.chatType as string | undefined
        const isClearFromViewMessageDialog = req.query?.isClearFromViewMessageDialog as string | undefined
        const memoryType = req.query?.memoryType as string | undefined
        const sessionId = req.query?.sessionId as string | undefined
        const apiResponse = await chatflowsService.removeAllChatMessages(
            chatflowId,
            chatId,
            chatType,
            isClearFromViewMessageDialog,
            memoryType,
            sessionId
        )
        if (typeof apiResponse.executionError !== 'undefined') {
            res.status(apiResponse.status).send(apiResponse.msg)
        }
        return res.json(apiResponse)
    } catch (error) {
        next(error)
    }
}

export default {
    createChatMessage,
    getAllChatMessages,
    getAllInternalChatMessages,
    removeAllChatMessages
}