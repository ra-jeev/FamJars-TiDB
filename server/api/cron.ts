import { Schedule } from '@prisma/client';
import prisma from '../prisma';
import { Decimal } from '@prisma/client/runtime/library';

const getNextMoneyAt = (date: Date, schedule: Schedule) => {
  if (!schedule) {
    return;
  }

  const currDate = date.getDate();
  const currMonth = date.getMonth();

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
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);

  const eligibleJars = await prisma.jar.findMany({
    where: { nextMoneyAt: date },
  });

  console.log('eligibleJars: ', JSON.stringify(eligibleJars, null, 2));

  if (eligibleJars.length) {
    for (const jar of eligibleJars) {
      const res = await prisma.jar.update({
        where: { id: jar.id },
        data: {
          balance: {
            increment: jar.autoCreditAmount as Decimal,
          },
          nextMoneyAt: getNextMoneyAt(date, jar.autoCreditSchedule as Schedule),
          transactions: {
            create: {
              amount: jar.autoCreditAmount as Decimal,
              comment: 'Auto credited',
              type: 'Credit',
              pending: false,
              ownerId: jar.ownerId,
              familyId: jar.familyId,
            },
          },
        },
      });

      console.log('transaction res', res);
    }
  }

  return {
    status: 'ok',
  };
});
