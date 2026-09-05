import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClientProfile } from "../lib/service";

export function useUpdateClientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-profile"],
    mutationFn: updateClientProfile,
    onSuccess: (response) => {
      queryClient.setQueryData(["profile"], response.data);
    },
  });
}
