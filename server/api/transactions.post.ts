import { serverSupabaseUser } from '#supabase/server';
import prisma from '../prisma';

export default defineEventHandler(async (event) => {
  console.log('incoming post event for api/transactions');
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

  const data = await readBody(event);
  console.log(`create transaction called: ${JSON.stringify(data, null, 2)}`);

  if (!data.jarId) {
    throw createError({
      statusCode: 400,
      message: 'Missing jar id',
    });
  }

  const isChild = userData.role === 'Child';
  const jar = await prisma.jar.findUnique({ where: { id: data.jarId } });
  if (!jar) {
    throw createError({
      statusCode: 404,
      message: 'No such jar found',
    });
  } else if (
    (isChild && jar.ownerId !== userData.id) ||
    jar.familyId !== userData.familyId
  ) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Insufficient permissions.',
    });
  }

  const createData = {
    ...data,
    pending: isChild,
    ownerId: jar.ownerId,
    familyId: jar.familyId,
  };

  let transaction;
  if (isChild) {
    transaction = await prisma.transaction.create({
      data: createData,
    });
  } else {
    delete createData.jarId;
    const updatedJar = await prisma.jar.update({
      where: { id: jar.id },
      data: {
        balance: {
          increment: data.type === 'Credit' ? data.amount : -data.amount,
        },
        transactions: {
          create: createData,
        },
      },
    });

    console.log('updatedJar response', updatedJar);
  }

  console.log('create transaction response', transaction);

  return {
    status: 'ok',
    pending: isChild,
  };
});
