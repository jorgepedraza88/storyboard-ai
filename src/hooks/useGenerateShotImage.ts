import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateShotImage } from "@/services/shotGeneration";
import { shotsKey } from "@/hooks/useShots";
import type { Sequence, Shot } from "@/types/database";

export function useGenerateShotImage(sequenceId: string, sequence?: Sequence) {
  const queryClient = useQueryClient();
  const key = shotsKey(sequenceId);

  return useMutation({
    mutationFn: (shot: Shot) => generateShotImage(shot, sequence),
    onMutate: (shot) => {
      queryClient.setQueryData<Shot[]>(key, (shots) =>
        shots?.map((s) => (s.id === shot.id ? { ...s, status: "generating" as const } : s)),
      );
    },
    onSuccess: (updatedShot) => {
      queryClient.setQueryData<Shot[]>(key, (shots) =>
        shots?.map((shot) => (shot.id === updatedShot.id ? updatedShot : shot)),
      );
    },
  });
}
