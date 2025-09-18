import { type UseAxiosOptions, useAxios } from "giime";
import { type AxiosRequestConfig } from "axios";
import { type DeepRequired } from "../../interface";
import { type PostApiTaskType343Result, type PostApiTaskType343Params, type PostApiTaskType343Input } from "./postApiTaskType343";
import request from "@/api/gsync/service";

/**
 * coupang触发店铺后台优惠券任务
 * /api/task?type=343
 */
export function usePostApiTaskType343(config?: AxiosRequestConfig, options?: UseAxiosOptions<DeepRequired<PostApiTaskType343Result>>) {
    const useAxiosReturn = useAxios<DeepRequired<PostApiTaskType343Result>>(
        '/api/task?type=343',
        { method: 'post', ...config },
        request,
        { immediate: false, ...options }
    )

    function exec(params: PostApiTaskType343Params, input?: PostApiTaskType343Input, axiosConfig?: AxiosRequestConfig) {
        const paramsInput = {
        };
        return useAxiosReturn.execute({
            params: paramsInput,
            data: input,
            ...axiosConfig,
        });
    }
    return { ...useAxiosReturn, exec };
}
