import { Application } from 'https://deno.land/x/oak@v10.5.1/mod.ts';
import { EVENT } from './constant.ts';
import jobService from './services/job.ts';
import noteService from './services/note.ts';

const app = new Application();

app.use(async (ctx, next) => {
  const token = ctx.request.headers.get('x-gitlab-token');

  if (token !== Deno.env.get('GITLAB_WEBHOOK_TOKEN')) {
    ctx.response.status = 401;
    ctx.response.body = {
      success: false,
      message: 'unauthorized gitlab token',
    };
    return;
  }

  await next();
});

app.use(async (ctx) => {
  const event = ctx.request.headers.get('x-gitlab-event');

  try {
    switch (event) {
      case EVENT.JOB:
        await jobService(ctx);
        break;
      case EVENT.NOTE:
        await noteService(ctx);
        break;
    }

    ctx.response.body = {
      success: true,
    };
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: err.message,
    };
  }
});

await app.listen({ port: 8000 });
