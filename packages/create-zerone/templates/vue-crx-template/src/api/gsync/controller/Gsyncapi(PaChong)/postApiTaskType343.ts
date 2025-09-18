import request from "@/api/gsync/service";
import { type AxiosRequestConfig } from "axios";
import { type DeepRequired } from "../../interface";

export interface PostApiTaskType343Result {
}

/**
 * coupang触发店铺后台优惠券任务
 * /api/task?type=343
 */
export function postApiTaskType343(params: PostApiTaskType343Params, input?: PostApiTaskType343Input, config?: AxiosRequestConfig) {
    const paramsInput = {
    };
    return request.post<DeepRequired<PostApiTaskType343Result>>(`/api/task?type=343`, input, {
        params: paramsInput,
        ...config,
    });
}

export interface PostApiTaskType343Params {
}

export interface PostApiTaskType343Input {
    name: string;
    type: number;
    platform_id: number;
    credential_username: string;
    data: PostApiTaskType343InputData;
}

export interface PostApiTaskType343InputData {
    html: string;
}
