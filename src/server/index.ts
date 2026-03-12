import { Elysia, t } from 'elysia'
import { 
    getChallengeBySlug, 
    getChallengeWithResources,
    getCategoriesWithChallenges,
    getChallengesList,
    getChallengeResourcesByChallengeSlug,
    getAllCategories
} from './lib/db/queries'

export const app = new Elysia({
    "prefix":"/api"
})
    .get('/', 'Hello from ElysiaJS Backend!')
    .get('/health', () => ({ status: 'ok', timestamp: Date.now() }))
    .get('/message', () => ({ message: 'Hello from ElysiaJS API!' }))
    .post('/echo', ({ body }) => body, {
        body: t.Object({
            message: t.String()
        })
    })
    
    // 获取分类列表
    .get('/categories', async ({ query }) => {
        const language = (query.lang as string) || 'en'
        const categories = await getCategoriesWithChallenges(language)
        return categories
    })
    
    // 获取所有分类（不带挑战）
    .get('/categories/all', async () => {
        const categories = await getAllCategories()
        return categories
    })
    
    // 获取挑战列表（支持分页和筛选）
    .get('/challenges', async ({ query }) => {
        const language = (query.lang as string) || 'en'
        const category = query.category as string | undefined
        const difficulty = query.difficulty as string | undefined
        const page = parseInt(query.page as string) || 1
        const limit = parseInt(query.limit as string) || 10
        const search = query.search as string | undefined

        const result = await getChallengesList({
            language,
            category,
            difficulty,
            page,
            limit,
            search
        })
        
        return result
    })
    
    // 获取单个挑战详情
    .get('/challenges/:slug', async ({ params, query }) => {
        const slug = params.slug
        const lang = (query.lang as string) || 'en'
        const challenge = await getChallengeWithResources(slug, lang)
        
        if (!challenge) {
            return new Response(JSON.stringify({ error: 'Challenge not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        return challenge
    })
    
    // 获取挑战的所有资源
    .get('/challenges/:slug/resources', async ({ params, query }) => {
        const slug = params.slug
        const lang = (query.lang as string) || 'en'
        
        const challenge = await getChallengeBySlug(slug, lang)
        
        if (!challenge) {
            return new Response(JSON.stringify({ error: 'Challenge not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        
        const resources = await getChallengeResourcesByChallengeSlug(slug, lang)
        
        return {
            challenge,
            resources
        }
    })
