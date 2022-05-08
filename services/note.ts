import { Context, helpers } from 'https://deno.land/x/oak@v10.5.1/mod.ts';

export default async function job(ctx: Context) {
  const query = helpers.getQuery(ctx);
  const body = await ctx.request.body().value;
  const { merge_request: mr, object_attributes: attr, repository, user } = body;

  await fetch(`https://hooks.slack.com/services/${query.target}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [
        `${user.name} commented @ ${repository.name} - ${mr.title}`,
        attr.url,
        `\`${attr.position.new_path}:${
          attr.position.new_line ?? attr.position.old_line
        }\``,
        '',
        `> ${attr.description}`,
      ].join('\n'),
    }),
  });
}
