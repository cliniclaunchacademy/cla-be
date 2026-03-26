import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  username: Joi.string().trim().optional(),
});

export const labApplySchema = Joi.object({}).optional();

export const notificationReadSchema = Joi.object({}).optional();
