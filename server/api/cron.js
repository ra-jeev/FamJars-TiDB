import prisma from '../prisma';
export default defineEventHandler(async (event) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 1);
  date.setUTCHours(0, 0, 0, 0);

  console.log('new date', date.toISOString());

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
            increment: jar.autoCreditAmount,
          },
          transactions: {
            create: {
              amount: jar.autoCreditAmount,
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
