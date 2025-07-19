import { PrismaClient } from '@prisma/client';
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/journal');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get all journal entries
router.get('/entries', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tags, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    
    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { plainText: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      where.tags = {
        contains: tagArray.join('|') // Simple tag search
      };
    }
    
    const entries = await prisma.journalEntry.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy as string]: sortOrder }
    });
    
    const total = await prisma.journalEntry.count({ where });
    
    res.json({
      entries,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

// Get single journal entry
router.get('/entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await prisma.journalEntry.findUnique({
      where: { id: Number(id) }
    });
    
    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ error: 'Failed to fetch journal entry' });
  }
});

// Create new journal entry
router.post('/entries', async (req, res) => {
  try {
    const { title, content, plainText, tags, isPublic, mediaUrls } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    // Update tag usage counts
    if (tags && Array.isArray(tags)) {
      for (const tagName of tags) {
        await prisma.journalTag.upsert({
          where: { name: tagName },
          update: { useCount: { increment: 1 } },
          create: { name: tagName, useCount: 1 }
        });
      }
    }
    
    const entry = await prisma.journalEntry.create({
      data: {
        title,
        content,
        plainText: plainText || content.replace(/<[^>]*>/g, ''), // Strip HTML for plain text
        tags: tags ? JSON.stringify(tags) : null,
        isPublic: isPublic || false,
        mediaUrls: mediaUrls ? JSON.stringify(mediaUrls) : null
      }
    });
    
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
});

// Update journal entry
router.put('/entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, plainText, tags, isPublic, mediaUrls } = req.body;
    
    const existingEntry = await prisma.journalEntry.findUnique({
      where: { id: Number(id) }
    });
    
    if (!existingEntry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    // Update tag usage counts
    const oldTags = existingEntry.tags ? JSON.parse(existingEntry.tags) : [];
    const newTags = tags || [];
    
    // Decrement old tags
    for (const tagName of oldTags) {
      await prisma.journalTag.updateMany({
        where: { name: tagName },
        data: { useCount: { decrement: 1 } }
      });
    }
    
    // Increment new tags
    for (const tagName of newTags) {
      await prisma.journalTag.upsert({
        where: { name: tagName },
        update: { useCount: { increment: 1 } },
        create: { name: tagName, useCount: 1 }
      });
    }
    
    const entry = await prisma.journalEntry.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
        plainText: plainText || content.replace(/<[^>]*>/g, ''),
        tags: tags ? JSON.stringify(tags) : null,
        isPublic,
        mediaUrls: mediaUrls ? JSON.stringify(mediaUrls) : null
      }
    });
    
    res.json(entry);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
});

// Delete journal entry
router.delete('/entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingEntry = await prisma.journalEntry.findUnique({
      where: { id: Number(id) }
    });
    
    if (!existingEntry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }
    
    // Decrement tag usage counts
    if (existingEntry.tags) {
      const tags = JSON.parse(existingEntry.tags);
      for (const tagName of tags) {
        await prisma.journalTag.updateMany({
          where: { name: tagName },
          data: { useCount: { decrement: 1 } }
        });
      }
    }
    
    await prisma.journalEntry.delete({
      where: { id: Number(id) }
    });
    
    res.json({ message: 'Journal entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
});

// Get all tags
router.get('/tags', async (req, res) => {
  try {
    const tags = await prisma.journalTag.findMany({
      orderBy: { useCount: 'desc' }
    });
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Create new tag
router.post('/tags', async (req, res) => {
  try {
    const { name, color, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Tag name is required' });
    }
    
    const tag = await prisma.journalTag.create({
      data: { name, color, description }
    });
    
    res.status(201).json(tag);
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ error: 'Failed to create tag' });
  }
});

// Upload media
router.post('/media', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const mediaRecord = await prisma.journalMedia.create({
      data: {
        filename: req.file.originalname,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size
      }
    });
    
    // Return URL for frontend use
    const mediaUrl = `/api/journal/media/${mediaRecord.id}`;
    
    res.status(201).json({
      id: mediaRecord.id,
      url: mediaUrl,
      filename: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

// Serve media files
router.get('/media/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const media = await prisma.journalMedia.findUnique({
      where: { id: Number(id) }
    });
    
    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }
    
    // Check if file exists
    if (!fs.existsSync(media.filePath)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }
    
    res.setHeader('Content-Type', media.fileType);
    res.sendFile(path.resolve(media.filePath));
  } catch (error) {
    console.error('Error serving media:', error);
    res.status(500).json({ error: 'Failed to serve media' });
  }
});

export default router; 