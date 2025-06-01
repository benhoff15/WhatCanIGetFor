import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../create-context';
import { sendSupportEmail } from '../../utils/sendSupportEmail';
import { TRPCError } from '@trpc/server';

// Input schema for the contact form
export const contactFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }),
  subject: z.string().min(1, { message: 'Subject is required' }),
  message: z.string().min(1, { message: 'Message is required' }),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const contactRouter = createTRPCRouter({
  submit: publicProcedure
    .input(contactFormSchema)
    .mutation(async ({ input }) => {
      const { name, email, subject, message } = input;

      try {
        const result = await sendSupportEmail(name, email, subject, message);

        if (!result.success) {
          console.error('Failed to send support email via contact form:', result.error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || 'Failed to send message. Please try again later.',
          });
        }

        return {
          success: true,
          message: 'Message sent successfully!',
          // Optionally return data from sendSupportEmail if needed by client
          // data: result.data 
        };
      } catch (error) {
        // Catch errors from sendSupportEmail if they weren't caught and returned as {success: false}
        // Or if TRPCError was thrown directly
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('An unexpected error occurred in contact submit mutation:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `An unexpected error occurred: ${errorMessage}`,
        });
      }
    }),
});
