import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProfilePicture } from "../lib/service";
import type { Profile } from "../types/profile";

export function useDeleteProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfilePicture,
    onSuccess: () => {
      queryClient.setQueryData<Profile>(["profile"], (previous) =>
        previous ? { ...previous, profileImage: null } : previous,
      );
    },
  });
}
