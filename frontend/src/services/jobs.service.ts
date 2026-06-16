import { apiFetch } from "@/lib/api";
import {
  JobsResponse,
  SingleJobResponse,
} from "@/types/job";

export const JobsService = {
  getAll: () =>
    apiFetch<JobsResponse>("/jobs"),

  getById: (id: string) =>
    apiFetch<SingleJobResponse>(
      `/jobs/${id}`
    ),
};