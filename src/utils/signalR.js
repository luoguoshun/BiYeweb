/*
 * @LastEditTime: 2023-03-24 15:21:12
 * @Descripttion: signalR中心
 */
import * as signalR from '@microsoft/signalr';
import store from '../store/index.js';
import { baseUrl } from '@/config/defaultString.js';
import { Message, Notification } from 'element-ui';
//连接集线器
const connectionBuilder = new signalR.HubConnectionBuilder()
  .withUrl(`${baseUrl}/chatHub`, {
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets,
    accessTokenFactory: () => store.getters['token/accessToken'], //连接集线器需要认证
  })
  .withAutomaticReconnect([0, 2000, 10000, 30000]) //配置自动重新连接服务器时间
  .configureLogging(signalR.LogLevel.Error) //配置日志
  .build();
//#region  注册方法 用于服务器向客户端调取
connectionBuilder.on('SendMessageToGroup', function (message) {
  console.log(message.Content);
});
connectionBuilder.on('SendPrivateMessage', function (message) {
  Notification.info({
    title: message.Title,
    message: message.Content,
    position: 'bottom-right',
  });
});
connectionBuilder.on('Abort', function (message) {
  // Message.warning(message.Content);
});
//#endregion
export default {
  connectionBuilder,
};
