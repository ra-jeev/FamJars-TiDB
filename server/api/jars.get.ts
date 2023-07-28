import { serverSupabaseUser } from '#supabase/server';
import prisma from '../prisma';

export default defineEventHandler(async (event) => {
  console.log('incoming get event for api/jars');
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const userData = await prisma.user.findUnique({ where: { id: user.id } });
  if (!userData) {
    throw createError({
      statusCode: 500,
      message: 'Server error',
    });
  }

  const where: { [key: string]: string } = {};
  if (userData.role === 'Child') {
    where.ownerId = userData.id;
  } else {
    where.familyId = userData.familyId as string;
  }

  const res = await prisma.jar.findMany({
    where,
    include: { owner: { select: { name: true } } },
  });

  console.log('res of jars get', JSON.stringify(res, null, 2));

  return {
    status: 'ok',
    data: { ...res },
  };
});
