import { H3Event } from 'h3';
import {
  serverSupabaseUser,
  serverSupabaseServiceRole,
} from '#supabase/server';
import prisma from '../prisma';
import { OnboardingStep, Role } from '@prisma/client';

const createFamily = async (userId: string, data: { [key: string]: any }) => {
  console.log('incoming data', data);
  if (!data.currencyCode || !data.name) {
    throw createError({
      statusCode: 400,
      message: 'Missing name or currency code',
    });
  }

  let familyRes;
  try {
    familyRes = await prisma.family.create({
      data: {
        name: data.name,
        currencyCode: data.currencyCode,
      },
    });

    console.log('family created res', familyRes);

    const userUpdateRes = await prisma.user.update({
      where: { id: userId },
      data: { familyId: familyRes.id, onboardingStep: 'Members' },
    });

    console.log('userUpdateRes', userUpdateRes);

    return familyRes;
  } catch (error) {
    console.log('failed to create team', error);
    if (familyRes) {
      await prisma.family.delete({ where: { id: familyRes.id } });
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to create family',
    });
  }
};

const addFamilyMembers = async (
  event: H3Event,
  userData: any,
  data: { [key: string]: any }
) => {
  if (!data.familyId || !data.members || !data.members.length) {
    throw createError({
      statusCode: 400,
      message: 'Missing familyId or members to add',
    });
  }

  if (userData.familyId !== data.familyId) {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Insufficient permissions.',
    });
  }

  const client = serverSupabaseServiceRole(event);

  try {
    const userPromises = [];
    const emailRoleMap: { [key: string]: string } = {};
    for (const member of data.members) {
      emailRoleMap[member.email] = member.role;

      userPromises.push(
        client.auth.admin.createUser({
          email: member.email,
          email_confirm: true,
          password: member.password,
          user_metadata: { name: member.name },
        })
      );
    }

    const userResponses = await Promise.all(userPromises);
    console.log('response of supabase create users: ', userResponses);

    const tiDBUsersData = [];
    for (const userResponse of userResponses) {
      const user = userResponse.data.user;
      if (user) {
        tiDBUsersData.push({
          id: user.id,
          name: user.user_metadata.name,
          email: user.email as string,
          role: emailRoleMap[user.email as string] as Role,
          onboardingStep: 'Completed' as OnboardingStep,
          familyId: userData.familyId,
        });
      }
    }

    const tiDBUsersRes = await prisma.user.createMany({
      data: tiDBUsersData,
    });

    console.log('created new users in tiDB with createMany: ', tiDBUsersRes);

    if (userData.onboardingStep === 'Members') {
      const updatedUser = await prisma.user.update({
        where: { id: userData.id },
        data: {
          onboardingStep: 'Jars',
        },
      });

      console.log('updated user:', updatedUser);
    }

    return tiDBUsersRes;
  } catch (error) {
    console.log('failed to add members', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to add family members',
    });
  }
};

export default defineEventHandler(async (event) => {
  console.log('incoming post event for api/families/');

  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const userData = await prisma.user.findUnique({ where: { id: user.id } });
  if (userData?.role !== 'Admin') {
    throw createError({
      statusCode: 403,
      message: 'Access denied. Insufficient permissions.',
    });
  }

  const body = await readBody(event);
  console.log('body', body);

  if (!body.type || !['CREATE', 'ADD_MEMBERS'].includes(body.type)) {
    throw createError({
      statusCode: 400,
      message: 'Missing or unsupported request type',
    });
  }

  let data;
  if (body.type === 'CREATE') {
    data = await createFamily(user.id, body);
  } else {
    data = await addFamilyMembers(event, userData, body);
  }

  return {
    status: 'ok',
    data,
  };
});
