import { Router } from 'express';
import { SupabaseContentRepository } from '../repositories/SupabaseContentRepository';
import { ContentService } from '../services/ContentService';
import { validateAuth } from '../middleware/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const contentRepository = new SupabaseContentRepository();
const contentService = new ContentService(contentRepository);

// Create content
router.post('/', validateAuth, upload.single('file'), async (req, res) => {
  try {
    const result = await contentService.createContent(
      req.body,
      req.file ? new File([req.file.buffer], req.file.originalname, { type: req.file.mimetype }) : undefined
    );

    if (result.error) {
      return res.status(400).json(result);
    }
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: { message: 'Internal server error', code: 'SERVER_ERROR' } });
  }
});

// Update content
router.put('/:id', validateAuth, upload.single('file'), async (req, res) => {
  try {
    const result = await contentService.updateContent(
      req.params.id,
      req.body,
      req.file ? new File([req.file.buffer], req.file.originalname, { type: req.file.mimetype }) : undefined
    );

    if (result.error) {
      return res.status(400).json(result);
    }
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: { message: 'Internal server error', code: 'SERVER_ERROR' } });
  }
});

// Delete content
router.delete('/:id', validateAuth, async (req, res) => {
  try {
    const result = await contentService.deleteContent(req.params.id);
    if (result.error) {
      return res.status(400).json(result);
    }
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: { message: 'Internal server error', code: 'SERVER_ERROR' } });
  }
});

// Get content by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await contentService.getContent(req.params.id);
    if (result.error) {
      return res.status(404).json(result);
    }
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: { message: 'Internal server error', code: 'SERVER_ERROR' } });
  }
});

// List content with filters
router.get('/', async (req, res) => {
  try {
    const filters = {
      communityId: req.query.communityId as string,
      categoryId: req.query.categoryId as string,
      format: req.query.format as string,
      accessLevel: req.query.accessLevel as string,
      featured: req.query.featured === 'true',
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const result = await contentService.listContent(filters);
    if (result.error) {
      return res.status(400).json(result);
    }
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: { message: 'Internal server error', code: 'SERVER_ERROR' } });
  }
});

export default router; 