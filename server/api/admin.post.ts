import urllib from 'urllib';
import { serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  console.log('incoming get event for api/admin');
  const user = await serverSupabaseUser(event);
  console.log('got some auth user', user);
  if (!user || user.user_metadata.role !== 'SuperAdmin') {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const body = await readBody(event);
  if (!body.prompt) {
    throw createError({
      statusCode: 400,
      message: "Can't make a request without a prompt",
    });
  }

  const { tiDBDataApiPrivateKey, tiDBDataApiPublicKey } = useRuntimeConfig();
  console.log('the TIDB API Keys', tiDBDataApiPrivateKey, tiDBDataApiPublicKey);

  const url =
    'https://eu-central-1.data.tidbcloud.com/api/v1beta/app/chat2query-HUMLdacW/endpoint/chat2data';
  const auth = `${tiDBDataApiPublicKey}:${tiDBDataApiPrivateKey}`;

  try {
    const resp = await urllib.request(url, {
      contentType: 'json',
      data: {
        cluster_id: '1379661944646226760',
        database: 'FamJarsDB',
        instruction: body.prompt,
      },
      digestAuth: auth,
      method: 'POST',
      timeout: 50000,
    });

    console.log('response from urllib', JSON.parse(resp.data));

    return {
      status: 'ok',
      data: JSON.parse(resp.data),
    };
  } catch (error) {
    console.log('error from urllib', error);
    throw createError({
      statusCode: 500,
      message: 'failed to get response',
    });
  }
});
