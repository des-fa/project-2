import { Router } from 'express'
import authenticateUser from './_middlewares/authenticate-user.js'

const router = Router()

// API | AUTH
router.post('/api/auth/signup', (await import('./controllers/api/auth/signup.js')).default)
router.post('/api/auth/login', (await import('./controllers/api/auth/login.js')).default)
router.delete('/api/auth/logout', (await import('./controllers/api/auth/logout.js')).default)

// API | MY USER | AUTH REQUIRED
router.get('/api/my/user', authenticateUser('json'), (await import('./controllers/api/my/user/show.js')).default)
router.put('/api/my/user/settings', authenticateUser('json'), (await import('./controllers/api/my/user/settings/update.js')).default)

// API | MY PAGE | AUTH REQUIRED
// router.get('/api/my/page', authenticateUser('json'), (await import('./controllers/api/my/page/show.js')).default)

// API | MY ENTRIES | AUTH REQUIRED
router.post('/api/my/entries', authenticateUser('json'), (await import('./controllers/api/my/entries/create.js')).default)
router.get('/api/my/entries', authenticateUser('json'), (await import('./controllers/api/my/entries/index.js')).default)
router.get('/api/my/entries/:id', authenticateUser('json'), (await import('./controllers/api/my/entries/show.js')).default)
router.put('/api/my/entries/:id', authenticateUser('json'), (await import('./controllers/api/my/entries/update.js')).default)
// router.delete('/api/my/entries/:id', authenticateUser('json'), (await import('./controllers/api/my/entries/destroy.js')).default)

// API | MY COMMENTS | AUTH REQUIRED
// router.post('/api/my/comments', authenticateUser('json'), (await import('./controllers/api/my/comments/create.js')).default)
// router.put('/api/my/comments/:id', authenticateUser('json'), (await import('./controllers/api/my/comments/update.js')).default)
// router.delete('/api/my/comments/:id', authenticateUser('json'), (await import('./controllers/api/my/comments/destroy.js')).default)

// API | PUBLIC POSTS | AUTH REQUIRED
// router.get('/api/public-posts', authenticateUser('json'), (await import('./controllers/api/public-posts/index.js')).default)
// router.get('/api/public-posts/:id', authenticateUser('json'), (await import('./controllers/api/public-posts/show.js')).default)

// API | NOT FOUND
// router.use('/api', (await import('./controllers/api/not-found.js')).default)

// PAGES | HOMEPAGE | STATIC
// router.get('/', (await import('./controllers/pages/home.js')).default)

// PAGES | MY USER | AUTH REQUIRED
// router.get('/my/user/settings/edit', authenticateUser('html'), (await import('./controllers/pages/my/user/settings/edit.js')).default)

// PAGES | MY PAGE | AUTH REQUIRED
// router.get('/my/page', authenticateUser('html'), (await import('./controllers/pages/my/page/show.js')).default)

// PAGES | MY ENTRIES | AUTH REQUIRED
// router.get('/my/entries', authenticateUser('html'), (await import('./controllers/pages/my/entries/index.js')).default)
// router.get('/my/entries/:id', authenticateUser('html'), (await import('./controllers/pages/my/entries/show.js')).default)
// router.get('/my/entries/:id/edit', authenticateUser('html'), (await import('./controllers/pages/my/entries/edit.js')).default)

// PAGES | PUBLIC POSTS | AUTH REQUIRED
// router.get('/public-posts', (await import('./controllers/pages/public-posts/index.js')).default)
// router.get('/public-posts/:id', (await import('./controllers/pages/public-posts/show.js')).default)

// PAGES | NOT FOUND
router.use((await import('./controllers/pages/not-found.js')).default)

export default router
