import { serverSupabaseUser } from '#supabase/server';
import prisma from '../../prisma';

export default defineEventHandler(async (event) => {
  console.log('incoming get event for api/users/');
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  if (!event.context.params?.id || event.context.params.id !== 'me') {
    throw createError({
      statusCode: 400,
      message: 'Invalid user id',
    });
  }

  console.log(`got some auth user: ${JSON.stringify(user, null, 2)}`);

  const res = await prisma.user.findUnique({
    where: { id: user.id },
    include: { family: { select: { name: true, currencyCode: true } } },
  });

  console.log('res of user get', JSON.stringify(res, null, 2));

  return {
    status: 'ok',
    data: { ...res },
  };
});
