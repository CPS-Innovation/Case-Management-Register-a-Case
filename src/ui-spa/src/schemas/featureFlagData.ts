import { z } from "zod";

export const FeatureFlagData = z.object({
  caseRegistrationV2: z.boolean(),
});

export type FeatureFlagData = z.infer<typeof FeatureFlagData>;
