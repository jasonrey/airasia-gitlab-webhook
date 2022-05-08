import { Context, helpers } from 'https://deno.land/x/oak@v10.5.1/mod.ts';
import { JOB } from '../constant.ts';

export default async function job(ctx: Context) {
  const query = helpers.getQuery(ctx);
  const body = await ctx.request.body().value;
  const { build_status, build_stage, build_id, repository } = body;

  if (build_status === JOB.BUILD_STATUS.FAILED) {
    await fetch(`https://hooks.slack.com/services/${query.target}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: `Pipeline Job Failure @ ${repository.name} - ${build_stage} ${repository.homepage}/-/jobs/${build_id}`,
      }),
    });
  }
}
