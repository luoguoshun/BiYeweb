/*
 * @LastEditTime: 2023-03-31 10:24:48
 * @Descripttion: 
 */
import Mock from "mockjs";
import menuApi from "./menu";
import { baseUrl } from "@/config/defaultString";

// 设置200-2000毫秒延时请求数据
Mock.setup({
  timeout: "200-2000",
});
// ##定义Mock接口##
Mock.mock(`${baseUrl}/api/getMenuList`, menuApi.getMenuList);
