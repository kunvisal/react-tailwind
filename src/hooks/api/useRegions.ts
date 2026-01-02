import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { regionsApi, CreateRegionRequest, UpdateRegionRequest } from "../../services/api";
import { PaginationParams } from "../../services/api/types";

export function useRegions(params?: PaginationParams & { isActive?: boolean }) {
  return useQuery({
    queryKey: ["regions", params],
    queryFn: () => regionsApi.getRegions(params),
  });
}

export function useRegion(id: string) {
  return useQuery({
    queryKey: ["regions", id],
    queryFn: () => regionsApi.getRegionById(id),
    enabled: !!id,
  });
}

export function useCreateRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRegionRequest) => regionsApi.createRegion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
    },
  });
}

export function useUpdateRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRegionRequest }) =>
      regionsApi.updateRegion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
      queryClient.invalidateQueries({ queryKey: ["regions", variables.id] });
    },
  });
}

export function useDeleteRegion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => regionsApi.deleteRegion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions"] });
    },
  });
}

