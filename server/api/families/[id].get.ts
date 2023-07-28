import { serverSupabaseUser } from '#supabase/server';
import prisma from '../../prisma';

export default defineEventHandler(async (event) => {
  console.log('incoming get event for api/families/');
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
      message: 'Invalid family id',
    });
  }

  const userData = await prisma.user.findUnique({ where: { id: user.id } });
  if (!userData) {
    throw createError({
      statusCode: 500,
      message: 'Server error',
    });
  }

  const res = await prisma.family.findUnique({
    where: { id: userData.familyId as string },
    include: { members: true },
  });

  console.log('res of family get', JSON.stringify(res, null, 2));

  return {
    status: 'ok',
    data: { ...res },
  };
});
