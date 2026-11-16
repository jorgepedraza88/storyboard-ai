import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShotPosition } from "@/services/shots";
import { shotsKey } from "@/hooks/useShots";
import type { Shot } from "@/types/database";

export function useReorderShots(sequenceId: string) {
  const queryClient = useQueryClient();
  const key = shotsKey(sequenceId);

  return useMutation({
    mutationFn: ({ id, position }: { id: string; position: number }) =>
      updateShotPosition(id, position),
    onMutate: async ({ id, position }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Shot[]>(key);

      queryClient.setQueryData<Shot[]>(key, (shots) => {
        if (!shots) return shots;
        return shots
          .map((shot) => (shot.id === id ? { ...shot, position } : shot))
          .sort((a, b) => a.position - b.position);
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}
