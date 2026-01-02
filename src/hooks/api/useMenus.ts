import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menusApi, CreateMenuItemRequest, UpdateMenuItemRequest } from "../../services/api";

export function useMenuStructure() {
  return useQuery({
    queryKey: ["menus"],
    queryFn: () => menusApi.getMenuStructure(),
  });
}

export function useUserMenu() {
  return useQuery({
    queryKey: ["menus", "user-menu"],
    queryFn: () => menusApi.getUserMenu(),
  });
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: ["menus", id],
    queryFn: () => menusApi.getMenuById(id),
    enabled: !!id,
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMenuItemRequest) => menusApi.createMenuItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuItemRequest }) =>
      menusApi.updateMenuItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => menusApi.deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menus"] });
    },
  });
}

