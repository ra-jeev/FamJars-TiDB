import { serverSupabaseUser } from '#supabase/server';
import { Schedule } from '@prisma/client';
import prisma from '../prisma';

const getNextMoneyAt = (schedule: Schedule) => {
  if (!schedule) {
    return;
  }

  const date = new Date();
  const currDate = date.getDate();
  const currMonth = date.getMonth();

  date.setUTCHours(0, 0, 0, 0);

  if (schedule === 'Daily') {
    date.setUTCDate(currDate + 1);
  } else if (schedule === 'Weekly') {
    // Pay after 7 Days
    date.setUTCDate(currDate + 7);
  } else if (schedule === 'Fortnightly') {
    // Pay after 14 Days
    date.setUTCDate(currDate + 14);
  } else if (schedule === 'Monthly') {
    // Pay on the 1st of every month
    date.setUTCMonth(currMonth + 1, 1);
  }

  return date;
};

export default defineEventHandler(async (event) => {
  console.log('incoming post event for api/jars/');
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

  if (!['Admin', 'Member'].includes(userData.role)) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Insufficient permissions.',
    });
  }

  const body = await readBody(event);
  console.log('body', body);

  if (!body.jars || !body.jars.length) {
    throw createError({
      statusCode: 400,
      message: 'No jars to create',
    });
  }

  try {
    const newJars = [];

    for (const jar of body.jars) {
      const jarData = {
        ...jar,
        name: jar.name,
        balance: jar.balance || 0,
        ownerId: jar.ownerId,
        autoCreditAmount: jar.autoCreditAmount || 0,
        autoCreditSchedule: jar.autoCreditSchedule || undefined,
        familyId: userData.familyId,
      };

      if (jar.autoCreditAmount && jar.autoCreditSchedule) {
        jarData.nextMoneyAt = getNextMoneyAt(jar.autoCreditSchedule);
      }

      if (jar.balance) {
        jarData.transactions = {
          create: {
            amount: jar.balance,
            comment: '🚀 Jar created',
            type: 'Credit',
            familyId: userData.familyId,
            ownerId: jar.ownerId,
            pending: false,
          },
        };
      }

      const newJar = await prisma.jar.create({
        data: jarData,
      });

      newJars.push(newJar);
    }

    console.log('created jars response', newJars);

    if (userData.onboardingStep === 'Jars') {
      console.log('updating the user for onboarding');
      const updatedUser = await prisma.user.update({
        where: { id: userData.id },
        data: { onboardingStep: 'Completed' },
      });

      console.log('update user response', updatedUser);
    }

    return {
      status: 'ok',
      data: newJars,
    };
  } catch (error) {
    console.log('failed to create jars', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create jars',
    });
  }
});
