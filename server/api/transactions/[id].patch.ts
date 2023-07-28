import { serverSupabaseUser } from '#supabase/server';
import prisma from '../../prisma';

export default defineEventHandler(async (event) => {
  console.log('incoming patch event for api/transactions');
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const data = await readBody(event);
  console.log(`patch transaction called: ${JSON.stringify(data, null, 2)}`);

  const transactionId = event.context.params?.id;
  if (!transactionId) {
    throw createError({
      statusCode: 400,
      message: 'Missing transaction id',
    });
  }

  const userData = await prisma.user.findUnique({ where: { id: user.id } });
  if (!userData) {
    throw createError({
      statusCode: 500,
      message: 'Server error',
    });
  } else if (userData.role === 'Child') {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Insufficient permissions.',
    });
  }

  const transaction = await prisma.transaction.update({
    where: { id: transactionId, familyId: userData.familyId as string },
    data: {
      ...data,
    },
  });

  console.log('updated transaction', transaction);
  const updatedJar = await prisma.jar.update({
    where: { id: transaction.jarId },
    data: {
      balance: {
        increment:
          transaction.type === 'Credit'
            ? transaction.amount
            : -transaction.amount,
      },
    },
  });
  console.log('updated jar', updatedJar);

  return {
    status: 'ok',
    pending: transaction.pending,
  };
});
