import 'reflect-metadata';
import express from 'express';
import path from 'path';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './server/app.module.ts';
import { createServer as createViteServer } from 'vite';

async function bootstrap() {
  const expressApp = express();
  expressApp.use(express.json());

  // Bootstrap NestJS on Express adapter
  const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    logger: ['error', 'warn', 'log'],
  });

  nestApp.setGlobalPrefix('api');
  await nestApp.init();

  const PORT = 3000;

  // Mount Vite middleware for dev or serve static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    expressApp.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    expressApp.use(express.static(distPath));
    expressApp.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  expressApp.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NestJS Calculator Server running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start NestJS Calculator server:', err);
  process.exit(1);
});
