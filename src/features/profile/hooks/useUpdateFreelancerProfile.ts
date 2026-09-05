import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFreelancerProfile } from "../lib/service";

export function useUpdateFreelancerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-profile"],
    mutationFn: updateFreelancerProfile,
    onSuccess: (response) => {
      queryClient.setQueryData(["profile"], response.data);
    },
  });
}
