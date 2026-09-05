import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfilePicture } from "../lib/service";
import type { Profile } from "../types/profile";

export function useUploadProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: (response) => {
      queryClient.setQueryData<Profile>(["profile"], (previous) =>
        previous
          ? {
              ...previous,
              profileImage: response.data.profileImageUrl,
              updatedAt: response.data.updatedAt,
            }
          : previous,
      );
    },
  });
}
