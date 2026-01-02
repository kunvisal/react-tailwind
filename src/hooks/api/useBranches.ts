import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { branchesApi, CreateBranchRequest, UpdateBranchRequest } from "../../services/api";
import { PaginationParams } from "../../services/api/types";

export function useBranches(params?: PaginationParams & { regionId?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ["branches", params],
    queryFn: () => branchesApi.getBranches(params),
  });
}

export function useBranch(id: string) {
  return useQuery({
    queryKey: ["branches", id],
    queryFn: () => branchesApi.getBranchById(id),
    enabled: !!id,
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBranchRequest) => branchesApi.createBranch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBranchRequest }) =>
      branchesApi.updateBranch(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey: ["branches", variables.id] });
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => branchesApi.deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
}

