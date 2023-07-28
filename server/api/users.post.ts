import { serverSupabaseUser } from '#supabase/server';
import prisma from '../prisma';

export default defineEventHandler(async (event) => {
  console.log('incoming post event for api/users/', event);
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  console.log(`got some auth user: ${JSON.stringify(user, null, 2)}`);

  const res = await prisma.user.create({
    data: {
      id: user.id,
      name: user.user_metadata.name,
      email: user.email as string,
      role: 'Admin',
      onboardingStep: 'Family',
    },
  });

  console.log('res of user creation', JSON.stringify(res, null, 2));

  return {
    status: 'ok',
  };
});
