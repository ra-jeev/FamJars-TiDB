import { serverSupabaseUser } from '#supabase/server';
import prisma from '../prisma';

export default defineEventHandler(async (event) => {
  console.log('incoming get event for api/transactions');
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

  const query = getQuery(event);
  const limit = query.limit ? parseInt(query.limit as string) : 25;
  console.log('incoming query', query);

  const where: { [key: string]: string } = {};
  if (userData.role === 'Child') {
    where.ownerId = userData.id;
  } else {
    where.familyId = userData.familyId as string;
  }

  const res = await prisma.transaction.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { jar: { select: { name: true } } },
  });

  console.log('res of jars get', JSON.stringify(res, null, 2));

  return {
    status: 'ok',
    data: { ...res },
  };
});
