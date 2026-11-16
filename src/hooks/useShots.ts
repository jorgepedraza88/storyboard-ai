import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createShot,
  deleteShot,
  listShots,
  updateShotFields,
  type ShotFields,
} from "@/services/shots";

const shotsKey = (sequenceId: string) => ["shots", sequenceId] as const;

export function useShots(sequenceId: string) {
  return useQuery({
    queryKey: shotsKey(sequenceId),
    queryFn: () => listShots(sequenceId),
    enabled: !!sequenceId,
  });
}

export function useCreateShot(sequenceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fields: ShotFields) => createShot(sequenceId, fields),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shotsKey(sequenceId) }),
  });
}

export function useUpdateShot(sequenceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fields }: { id: string; fields: ShotFields }) =>
      updateShotFields(id, fields),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shotsKey(sequenceId) }),
  });
}

export function useDeleteShot(sequenceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteShot(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: shotsKey(sequenceId) }),
  });
}

export { shotsKey };
